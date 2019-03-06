import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import Map from "../Map";
import { calculateETA, isEmpty } from "../../utilities";
import { InfoDiv } from "../Invites/styles";
import {
  InviteDiv,
  PositiveButton,
  NegativeButton,
  H3,
  TitleOfSection
} from "./styles";

const KYHLocation = { latitude: 59.313437, longitude: 18.110645 };

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
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const hostBookingKeyDict = snapshot.val();
        if (hostBookingKeyDict === null) {
          this.setState({
            myEvents: null
          });
        } else {
          this.setState({
            myEvents: {}
          });

          const hosBookingKeyList = Object.keys(hostBookingKeyDict);

          hosBookingKeyList.forEach(bookingID => {
            this.props.firebase.event(bookingID).once("value", snapshot => {
              const booking = snapshot.val();

              this.setState(prevState => {
                const newMyEvents = { ...prevState.myEvents };
                newMyEvents[bookingID] = booking;
                return {
                  myEvents: newMyEvents
                };
              }); // Closing setState

              const timeList = Object.keys(booking.time);
              let bookingStartTime = parseInt(timeList[0]);
              let startTimeETA = bookingStartTime - 3600000;

              booking["startTime"] = bookingStartTime;
              booking["location"] = KYHLocation;
              const usersETA = {};
              booking["usersETA"] = usersETA;

              if (isEmpty(booking.hasAcceptedUid)) {
                return;
              }

              const acceptedUserList = Object.keys(booking.hasAcceptedUid);

              acceptedUserList.forEach(userID => {
                // Get last 2 known positions
                this.getLastKnownPosition(2, userID, positionList => {
                  let originLocation;
                  let currentLocation;
                  // Get originLocation
                  if (positionList[0].createdAt >= startTimeETA) {
                    originLocation = positionList[0];
                  } else {
                    return;
                  }

                  // Get currentLocation
                  if (positionList[1].createdAt >= startTimeETA) {
                    currentLocation = positionList[1];
                  } else {
                    return;
                  }

                  // When data from getLastKnownPosition() is recieved, get userName
                  this.props.firebase
                    .user(userID)
                    .child("username")
                    .once("value", snapshot => {
                      const userName = snapshot.val();

                      // Wen userName is recieved, update state

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
                      this.setState({ [booking.eventUid]: usersETA });
                    }); // Closing firebase get userName
                }); // Closing getLastKnownPosition
              }); // Closing forEach
            }); // Closing firebase get booking
          }); // Closing forEach hosted eventID
        }
        this.setState({
          loading: false
        }); // Closing setState
      }); // Closing firebase get all hosted eventIDs
  } // Closing UpdateEvents()

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
    const noPending = "";
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
                  {!isEmpty(evt.usersETA) ? (
                    Object.keys(evt.usersETA).map(userID => {
                      const user = evt.usersETA[userID];

                      if (new Date() >= evt.startTime - 3600000) {
                        const ETA = calculateETA(
                          user.origin,
                          user.current,
                          evt.location
                        );
                        return (
                          <li key={userID}>
                            {user.userName.charAt(0) +
                              user.userName.slice(1).toLowerCase()}{" "}
                            ETA: {ETA}
                          </li>
                        );
                      } else {
                        return (
                          <li key={userID}>
                            {user.userName.charAt(0) +
                              user.userName.slice(1).toLowerCase()}{" "}
                            <i className="fas fa-check" />
                          </li>
                        );
                      }
                    })
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

                <PositiveButton
                  key={"Map EventID " + evt.eventUid}
                  onClick={event => this.displayMap(event, evt)}
                >
                  Show Map <i className="fas fa-map-marked-alt" />
                </PositiveButton>

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
