import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv, MyEventsButton, MyEventsDeleteButton } from "./styles";

const MyEvents = () => (
  <AuthUserContext.Consumer>
    {authUser => <MyEventsComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class MyEventsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noEvents: false,
      myEvents: [],
      loading: true
    };
  }

  //TO DO:
  // CONSOLE LOG
  //DESTRACTA EVT
  // ON på alla
  //WILL UNMOUNT ALLA ON TILL OFF

  updateEvents() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap == null) {
          this.setState({
            noEvents: true
          });
        } else {
          this.setState({
            myEvents: [],
            noEvents: false
          });

          const snapKeys = Object.keys(snap);
          console.log(snapKeys);
          snapKeys.forEach(key => {
            this.props.firebase.event(key).once("value", snapshot => {
              const eventSnaps = snapshot.val();
              this.setState({
                myEvents: [...this.state.myEvents, { ...eventSnaps }]
              });
            });
            return snap;
          });
        }
        this.setState({
          loading: false
        });
      });
  }
  componentDidMount() {
    this.updateEvents();
    // this.props.firebase
    //   .user(this.props.authUser.uid)
    //   .child("hostedEvents")
    //   .on("value", snapshot => {
    //     const snap = snapshot.val();
    //     if (snap == null) {
    //       this.setState({
    //         noEvents: true
    //       });
    //     } else {
    //       this.setState({
    //         myEvents: [],
    //         noEvents: false
    //       });

    //       const snapKeys = Object.keys(snap);
    //       console.log(snapKeys);
    //       snapKeys.forEach(key => {
    //         this.props.firebase.event(key).once("value", snapshot => {
    //           const eventSnaps = snapshot.val();
    //           this.setState({
    //             myEvents: [...this.state.myEvents, { ...eventSnaps }]
    //           });
    //         });
    //         return snap;
    //       });
    //     }
    //     this.setState({
    //       loading: false
    //     });
    //   });
  }

  deleteEvent(event, { eventUid, grouproom, time, isInvitedUid }) {
    console.log(
      "grupproum" + grouproom,
      "Tide" + time,
      "EventUID" + eventUid,
      "invitations" + isInvitedUid
    );
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
    console.log("tiderna i arrays" + times);

    times.forEach(slot => {
      this.props.firebase
        .bookedEventDateTimes()
        .child(grouproom)
        .update({
          [slot]: null
        });
    });

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

    this.props.firebase.event(eventUid).remove();

    this.updateEvents();
  }

  render() {
    const { loading, myEvents, noEvents } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "No one is invited.";
    const noDeclined = "No one has declined yet.";
    const noTimes = "You have no times? WTF?";
    if (noEvents) {
      return <h3>You have no events. </h3>;
    } else if (loading) {
      return (
        <div>
          Loading....
          <Spinner />
        </div>
      );
    } else if (myEvents === null) {
      return (
        <div>
          Fetching invites....
          <Spinner />
        </div>
      );
    } else {
      return (
        <section>
          {myEvents.map((evt, index) => (
            <InviteDiv key={"Div " + evt.eventUid}>
              <p key={"Host paragraph: " + evt.eventUid}>
                Host for this event: {evt.username}
              </p>
              <p key={"Date paragrah:" + evt.eventUid}>
                {new Date(evt.date).toLocaleDateString()}
              </p>
              <p key={"Event UID: " + evt.eventUid}>{evt.grouproom}</p>

              <ul>
                <li>Time: </li>

                {evt.time ? (
                  Object.keys(evt.time).map((key, index) => (
                    <li key={index + evt.eventUid}>
                      {new Date(Number(key)).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
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
              <ul>
                <li>Is invited: </li>
                {evt.isInvited ? (
                  Object.keys(evt.isInvited).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                  <li>{noInvited}</li>
                )}
              </ul>
              <ul>
                <li>Has accepted: </li>
                {evt.hasAccepted ? (
                  Object.keys(evt.hasAccepted).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                  <li>{noAccepted}</li>
                )}
              </ul>
              <ul>
                <li>Has declined: </li>
                {evt.hasDeclined ? (
                  Object.keys(evt.hasDeclined).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                  <li>{noDeclined}</li>
                )}
              </ul>

              <input
                type="textarea"
                placeholder="Description"
                value={evt.description}
                key={"Description event: " + evt.eventUid}
                readOnly
              />
              <MyEventsButton key={Math.random()}>Chatt?</MyEventsButton>
              <MyEventsDeleteButton
                key={"Delete event" + evt.eventUid}
                value={evt.eventUid}
                index={evt.index}
                onClick={event => this.deleteEvent(event, evt)}
              >
                Delete event
              </MyEventsDeleteButton>
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
