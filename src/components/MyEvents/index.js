import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import Map from "../Map";
import { isEmpty } from "../../utilities";
import { InfoDiv } from "../Invites/styles";
import { calculateDistance } from "../../utilities";
import { animateScroll as scroll } from "react-scroll";
import {
  InviteDiv,
  PositiveButton,
  NegativeButton,
  H3,
  TitleOfSection
} from "./styles";

export const KYHLocation = { latitude: 59.313437, longitude: 18.110645 };

const MyEvents = () => (
  <AuthUserContext.Consumer>
    {authUser => <MyEventsComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class MyEventsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myEvents: null,
      loading: true,
      mapBookingID: null
    };
  }

  /*
  getLastKnownPosition():

  This function looks in firebase on the last know position of the signed in user.
  */

  getLastKnownPosition = (
    num,
    userID = this.props.authUser.uid,
    callbackFunction
  ) => {
    this.props.firebase
      .user(userID)
      .child("positions")
      .limitToLast(num)
      .on("value", snapshot => {
        const lastKnownPositionObject = snapshot.val();
        if (lastKnownPositionObject) {
          const lastKnownPositions = Object.keys(lastKnownPositionObject).map(
            key => ({
              ...lastKnownPositionObject[key],
              uid: key
            })
          );

          callbackFunction(lastKnownPositions);
        }
      });
  };

  updateEvents() {
    // Get all hosted events for logged in user
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const hostBookingKeyDict = snapshot.val(); // Dictionary of all hosted booking objects
        if (hostBookingKeyDict === null) {
          this.setState({
            myEvents: null // User doesn't have any hosted bookings
          });
        } else {
          this.setState({
            myEvents: {} // All hosted booking objects
          });

          const hostBookingIDList = Object.keys(hostBookingKeyDict); // List of IDs of all hosted bokings

          hostBookingIDList.forEach(bookingID => {
            // For each bookingID
            this.props.firebase.event(bookingID).on("value", snapshot => {
              const booking = snapshot.val(); // Booking object

              // Update MyEvents state with current hoste bookings
              this.setState(prevState => {
                const newMyEvents = { ...prevState.myEvents };
                newMyEvents[bookingID] = booking;
                return {
                  myEvents: newMyEvents
                };
              }); // Closing setState

              const timeList = Object.keys(booking.time);
              let bookingStartTime = parseInt(timeList[0]);
              let bookingStartTimeETA = bookingStartTime - 3600000; // Start time to calculate ETA = 1h before start time of booking
              let bookingEndTime = bookingStartTime + 3600000;

              // Add data to MyEvents state
              booking["startTime"] = bookingStartTime;
              booking["bookingStartTimeETA"] = bookingStartTimeETA;
              booking["bookingEndTime"] = bookingEndTime;
              booking["location"] = KYHLocation;
              const usersETA = {};
              booking["usersETA"] = usersETA;

              // No one has accepted the booking, return
              if (isEmpty(booking.hasAcceptedUid)) {
                return;
              }

              const acceptedUserList = Object.keys(booking.hasAcceptedUid); // List of all accepted users

              acceptedUserList.forEach(userID => {
                // For each user

                // Get last 2 known positions
                this.getLastKnownPosition(2, userID, positionList => {
                  let originLocation;
                  let currentLocation;
                  // Get originLocation, only if position is registered within the time slot for calculating ETA
                  if (positionList[0].createdAt >= bookingStartTimeETA) {
                    originLocation = positionList[0];
                  } else {
                    return;
                  }

                  // Get currentLocation, only if position is registered within the time slot for calculating ETA
                  if (positionList[1].createdAt >= bookingStartTimeETA) {
                    currentLocation = positionList[1];
                  } else {
                    return;
                  }

                  // Get username of user
                  this.props.firebase
                    .user(userID)
                    .child("username")
                    .once("value", snapshot => {
                      const userName = snapshot.val();

                      // Get distance between users current position and the destination (position of booking)
                      const dist = calculateDistance(
                        currentLocation,
                        KYHLocation
                      );

                      if (dist < 100) {
                        // If within area of destination, add user to attendees and remove from hasAccepted & hasAcceptedUid
                        this.props.firebase
                          .event(bookingID)
                          .child("attendees")
                          .update({
                            [userName]: true
                          });
                        this.props.firebase
                          .event(bookingID)
                          .child("hasAccepted")
                          .update({
                            [userName]: null
                          });
                        this.props.firebase
                          .event(bookingID)
                          .child("hasAcceptedUid")
                          .update({
                            [userID]: null
                          });
                      } else {
                        // If not within area of booking, update state with users ID, name and 2 last known positions

                        usersETA[userID] = {
                          userID: userID,
                          userName: userName,
                          origin: {
                            latitude: originLocation.latitude,
                            longitude: originLocation.longitude,
                            timestamp: originLocation.createdAt
                          },
                          current: {
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            timestamp: currentLocation.createdAt
                          }
                        };
                        this.setState({
                          [booking.eventUid]: usersETA
                        });
                      } // Closing if withing school area
                    }); // Closing getLastKnownPosition
                }); // Closing firebase get userName
              }); // Closing forEach
            }); // Closing firebase get booking
          }); // Closing forEach hosted eventID
        }
        this.setState({
          loading: false
        }); // Closing setState
      }); // Closing firebase get all hosted eventIDs
  } // Closing UpdateEvents()

  /* 
  deleteEvent:

  This function does just that. It deletes the event from firebase. Even the invitations to this specific event that hasnt been accepted or declined yet.
  It erases it from Firebase completely.
  */

  deleteEvent(event, { eventUid, grouproom, time, isInvitedUid }) {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .off();

    this.setState({
      myEvents: {}
    });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("hostedEvents")
      .update({
        [eventUid]: null
      });

    const times = Object.keys(time);

    times.forEach(slot => {
      this.props.firebase
        .bookedEventDateTimes()
        .child(grouproom)
        .update({
          [slot]: null
        });
    });
    this.props.firebase.events().update({ [eventUid]: null });

    if (isInvitedUid === undefined) {
      return null;
    } else {
      const keysUsers = Object.keys(isInvitedUid);
      keysUsers.forEach(user => {
        this.props.firebase
          .user(user)
          .child("acceptedToEvents")
          .update({
            [eventUid]: null
          });
      });

      keysUsers.forEach(user => {
        this.props.firebase
          .user(user)
          .child("invitedToEvents")
          .update({
            [eventUid]: null
          });
      });
    }

    this.updateEvents();
  }

  displayMap = (event, evt) => {
    this.setState({
      mapBookingID: evt.eventUid
    });
  };

  closeMap = () => {
    this.setState({
      mapBookingID: null
    });
  };

  componentDidMount() {
    this.updateEvents();
  }

  componentWillUnmount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .off();

    this.props.firebase.events().off();
  }

  render() {
    const { loading, myEvents, mapBookingID } = this.state;
    const noAccepted = "";
    const noInvited = "";
    const noDeclined = "";
    const noTimes = "You have no times";
    const noAttendees = "";
    var pending = {
      color: "white"
    };
    var declined = {
      color: "#ee8d80"
    };
    var attendees = {
      color: "#7bcd9f"
    };
    var accept = {
      color: "#7bcd9f"
    };

    if (isEmpty(myEvents)) {
      return <H3> You have no events </H3>;
    } else if (loading) {
      return (
        <div>
          Loading...
          <Spinner />
        </div>
      );
    } else {
      let mapBooking = null;
      if (mapBookingID) {
        mapBooking = myEvents[mapBookingID];
      }
      return (
        <section>
          <TitleOfSection> Your Bookings </TitleOfSection>
          {mapBooking ? (
            <Map booking={mapBooking} close={this.closeMap} />
          ) : null}

          {Object.keys(myEvents).map(bookingID => {
            const evt = myEvents[bookingID];

            let showMap = false;

            if (
              evt.bookingStartTimeETA < Date.now() &&
              evt.bookingEndTime > Date.now()
            ) {
              showMap = true;
            }

            return (
              <InviteDiv key={"Div " + evt.eventUid}>
                <InfoDiv>
                  <p key={"Date paragrah: " + evt.eventUid}>
                    {" "}
                    Date: &nbsp;
                    {new Date(evt.date).toLocaleDateString()}
                  </p>
                  <div>
                    {evt.time ? (
                      Object.keys(evt.time).map((key, index) => (
                        <p key={index + evt.eventUid}>
                          Time: &nbsp;
                          {new Date(Number(key)).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}{" "}
                          -{" "}
                          {new Date(Number(key) + 3600000).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit"
                            }
                          )}
                        </p>
                      ))
                    ) : (
                      <li>{noTimes}</li>
                    )}
                  </div>
                </InfoDiv>
                <p className="GroupRoom" key={"Event UID: " + evt.eventUid}>
                  {evt.grouproom}
                </p>
                <ul>
                  <li>Invitees: </li>
                  {evt.isInvited ? (
                    Object.keys(evt.isInvited).map(
                      (isInvitedUserName, index) => (
                        <li style={pending} key={index + evt.eventUid}>
                          {isInvitedUserName.charAt(0) +
                            isInvitedUserName.slice(1).toLowerCase()}
                          <i className="fas fa-question" />
                        </li>
                      )
                    )
                  ) : (
                    <li>{noInvited}</li>
                  )}
                </ul>
                <ul>
                  {evt.hasAccepted ? (
                    Object.keys(evt.hasAccepted).map(
                      (hasAcceptedUserName, index) => (
                        <li style={accept} key={index + evt.eventUid}>
                          {hasAcceptedUserName.charAt(0) +
                            hasAcceptedUserName.slice(1).toLowerCase()}
                          <i className="fas fa-check" />
                        </li>
                      )
                    )
                  ) : (
                    <li>{noAccepted}</li>
                  )}
                </ul>
                <ul>
                  {evt.hasDeclined ? (
                    Object.keys(evt.hasDeclined).map(
                      (hasDeclinedUserName, index) => (
                        <li style={declined} key={index + evt.eventUid}>
                          {hasDeclinedUserName.charAt(0) +
                            hasDeclinedUserName.slice(1).toLowerCase()}
                          <i className="fas fa-user-slash" />
                        </li>
                      )
                    )
                  ) : (
                    <li>{noDeclined}</li>
                  )}
                </ul>
                <ul>
                  {evt.attendees ? (
                    Object.keys(evt.attendees).map(
                      (attendeesUserName, index) => (
                        <li style={attendees} key={index + evt.eventUid}>
                          {attendeesUserName.charAt(0) +
                            attendeesUserName.slice(1).toLowerCase()}
                          <i className="fas fa-user-check" />
                        </li>
                      )
                    )
                  ) : (
                    <li>{noAttendees}</li>
                  )}
                </ul>
                <input
                  type="textarea"
                  placeholder="Description"
                  value={evt.description}
                  key={"Description event: " + evt.eventUid}
                  readOnly
                />

                {}

                {/* Show button to show map only if event is within time slot for ETA*/}
                {showMap ? (
                  <PositiveButton
                    key={"Map EventID " + evt.eventUid}
                    onClick={event => {
                      this.displayMap(event, evt);
                      scroll.scrollToTop();
                    }}
                  >
                    Show Map <i className="fas fa-map-marked-alt" />
                  </PositiveButton>
                ) : (
                  <span />
                )}

                <NegativeButton
                  key={"Delete event" + evt.eventUid}
                  value={evt.eventUid}
                  index={evt.index}
                  onClick={event => this.deleteEvent(event, evt)}
                >
                  Delete event
                </NegativeButton>
              </InviteDiv>
            );
          })}
        </section>
      );
    }
  }
}

const condition = authUser => !!authUser;

const MyEventsComplete = withFirebase(MyEventsBase);

export default compose(withAuthorization(condition))(MyEvents);
