import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import {
  InviteDiv,
  ShowMapButton,
  DeleteEventButton,
  H3,
  TitleOfSection
} from "./styles";
import Map from "../Map";
import Geolocation from "../Map/geolocation"; //Code to test calculation of ETA - do not delete - being used by Nina

const MyEvents = () => (
  <AuthUserContext.Consumer>
    {authUser => <MyEventsComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

class MyEventsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myEvents: null,
      loading: true,
      showMap: false,
      mapEvent: []
    };
  }

  updateEvents() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap == null) {
          this.setState({
            myEvents: null
          });
        } else {
          this.setState({
            myEvents: {}
          });

          const snapKeys = Object.keys(snap);
          snapKeys.forEach(key => {
            this.props.firebase.event(key).once("value", snapshot => {
              const eventSnaps = snapshot.val();
              this.setState({
                myEvents: [...this.state.myEvents, { ...eventSnaps }]
              });
            });
          }); // CLosing forEach hosted eventID
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
      myEvents: []
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
      mapEvent: evt.eventUid,
      showMap: !this.state.showMap
    });
  };

  closeMap = () => {
    this.setState({
      showMap: false
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
    //Code to test calculation of ETA - do not delete - being used by Nina
    // return (
    //   <div>
    //     <Geolocation bookingID="-L_ECGgtNTC5No7wnJSA" />
    //     <Geolocation bookingID="-L_ECGgtNTC5No7wnJSA" />
    //   </div>
    // );

    const { loading, myEvents, showMap, mapEvent } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "";
    const noDeclined = "";
    const noTimes = "You have no times? WTF?";
    const noAttendees = "No one is here yet or the event hasn't started";
    const noPending = "No one is absent yet or the event hasn't started";

    if (isEmpty(myEvents)) {
      return <H3> You have no events </H3>;
    } else if (loading) {
      return (
        <div>
          Loading....
          <Spinner />
        </div>
      );

      //NEEDED??
      // } else if (myEvents === null) {
      //   return (
      //     <div>
      //       Fetching invites....
      //       <Spinner />
      //     </div>
      //   );
    } else {
      return (
        <section>
          <TitleOfSection> Your Bookings </TitleOfSection>
          {showMap ? <Map mapEvent={mapEvent} close={this.closeMap} /> : null}

          {myEvents.map((evt, index) => (
            <InviteDiv key={"Div " + evt.eventUid}>
              <p key={"Date paragrah: " + evt.eventUid}>
                {" "}
                Date: &nbsp;
                {new Date(evt.date).toLocaleDateString()}
              </p>

              <ul>
                {evt.time ? (
                  Object.keys(evt.time).map((key, index) => (
                    <li key={index + evt.eventUid}>
                      Time: &nbsp;
                      {new Date(Number(key)).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}{" "}
                      -{" "}
                      {new Date(Number(key) + 3600000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </li>
                  ))
                ) : (
                  <li>{noTimes}</li>
                )}
              </ul>

              <p key={"Event UID: " + evt.eventUid}>{evt.grouproom}</p>

              <ul>
                <li>Invitees: </li>
                {evt.isInvited ? (
                  Object.keys(evt.isInvited).map((isInvitedUserName, index) => (
                    <li key={index + evt.eventUid}>{isInvitedUserName}</li>
                  ))
                ) : (
                  <li>{noInvited}</li>
                )}
              </ul>
              <ul>
                {evt.hasAccepted ? (
                  Object.keys(evt.hasAccepted).map(
                    (hasAcceptedUserName, index) => (
                      <li key={index + evt.eventUid}>{hasAcceptedUserName}</li>
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
                      <li key={index + evt.eventUid}>{hasDeclinedUserName}</li>
                    )
                  )
                ) : (
                  <li>{noDeclined}</li>
                )}
              </ul>
              <ul>
                {evt.attendees ? (
                  Object.keys(evt.attendees).map((attendeesUserName, index) => (
                    <li key={index + evt.eventUid}>{attendeesUserName}</li>
                  ))
                ) : (
                  <li>{noAttendees}</li>
                )}
              </ul>
              <ul>
                {evt.pending ? (
                  Object.keys(evt.pending).map((pendingUserName, index) => (
                    <li key={index + evt.eventUid}>{pendingUserName}</li>
                  ))
                ) : (
                  <li>{noPending}</li>
                )}
              </ul>

              <input
                type="textarea"
                placeholder="Description"
                value={evt.description}
                key={"Description event: " + evt.eventUid}
                readOnly
              />
              <ShowMapButton
                key={"Map EventID " + evt.eventUid}
                onClick={event => this.displayMap(event, evt)}
              >
                Show Map
              </ShowMapButton>

              <DeleteEventButton
                key={"Delete event" + evt.eventUid}
                value={evt.eventUid}
                index={evt.index}
                onClick={event => this.deleteEvent(event, evt)}
              >
                Delete event
              </DeleteEventButton>
            </InviteDiv>
          ))}
        </section>
      );
    }
  }
}

const condition = authUser => !!authUser;

const MyEventsComplete = withFirebase(MyEventsBase);

export default compose(withAuthorization(condition))(MyEvents);
