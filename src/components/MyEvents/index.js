import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";

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
  //GÖRA EN DELETE FUNCTION PÅ DELETE EVENT:
  //TA BORT TIDER PÅ BOOKED EVENT DATE TIMES
  //TA BORT EVENT UID FRÅN USERN. HOSTED EVENTS
  //TA BORT HELA EVENTET FRÅN FIREBASE EVENT
  //TA BORT EVENT UID FRÅN ALLA USERS INBJUDNA OCH ACCEPTERADE.

  componentDidMount() {
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const acceptedVal = snapshot.val();
        if (acceptedVal === null) {
          this.setState({
            noEvents: true
          });
        } else {
          this.setState({
            myEvents: []
          });
          const acceptedKeys = Object.keys(acceptedVal);
          const test = acceptedKeys.map(key => {
            this.props.firebase
              .events()
              .child(key)
              .on("value", snapshot => {
                const snap = snapshot.val();
                this.setState({
                  myEvents: [...this.state.myEvents, snap]
                });
              });
          });
        }
        this.setState({
          loading: false
        });
      });
  }

  //TO DO
  //IN I INVITE UID OCH TA UT ANVÄNDARNA
  //ANVÄNDA ANVÄNDARNA OCH IN I DERAS USERS OCH GÖRA EVENTET TILL NULL

  deleteEvent(event) {
    const eventUid = event.target.value;
    let currentEventDate;
    let currentEventGroupRoom;

    // LÄSER AV TIDER DATUM OCH RUM FÖR SPECIFIKT EVENT

    this.props.firebase
      .events()
      .child(eventUid)
      .child("grouproom")
      .once("value", snapshot => {
        currentEventGroupRoom = snapshot.val();
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("date")
      .once("value", snapshot => {
        currentEventDate = snapshot.val();
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("time")
      .once("value", snapshot => {
        const currentEventTimes = Object.keys(snapshot.val());
        currentEventTimes.map(slot => {
          this.props.firebase
            .bookedEventDateTimes()
            .child(currentEventGroupRoom)
            .child(currentEventDate)
            .child("time")
            .update({
              [slot]: null
            });
        });
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("isInvitedUid")
      .once("value", snapshot => {
        if (snapshot.val() === null) {
          return null;
        } else {
          const includedUid = Object.keys(snapshot.val());

          includedUid.map(inUid =>
            this.props.firebase
              .user(inUid)
              .child("invitedToEvents")
              .update({
                [eventUid]: null
              })
          );
        }
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("isInvitedUid")
      .once("value", snapshot => {
        if (snapshot.val() === null) {
          return null;
        } else {
          const includedUid = Object.keys(snapshot.val());
          console.log(includedUid);
          includedUid.map(inUid =>
            this.props.firebase
              .user(inUid)
              .child("acceptedToEvent")
              .update({
                [eventUid]: null
              })
          );
        }
      });

    //TAR BORT EVENTET ÖVERALLT DÄR DEN ÄR REGISTRERAD PLUS MÖJLIGGÖR TIDERNA IGEN.

    this.props.firebase
      .user(this.props.authUser.uid)
      .child("hostedEvents")
      .update({
        [eventUid]: null
      });

    this.props.firebase.events().update({
      [eventUid]: null
    });
  }

  render() {
    const { loading, myEvents, noEvents } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "No one is invited.";
    const noDeclined = "No one has declined yet.";
    const noTimes = "You have no times? WTF?";

    if (loading) {
      return (
        <div>
          Loading... <Spinner />
        </div>
      );
    } else if (noEvents) {
      return <div>You have no MyEvents</div>;
    } else {
      return (
        <section>
          {myEvents.map((evt, index) => (
            <InviteDiv key={"Div " + evt.eventUid}>
              <p key={"Host paragraph: " + evt.eventUid}>
                Host for this event: {evt.username}
              </p>
              <p key={"Date paragrah:" + evt.eventUid}>{evt.date}</p>
              <p key={"Event UID: " + evt.eventUid}>{evt.grouproom}</p>

              <ul>
                <li>Time: </li>

                {evt.time ? (
                  Object.keys(evt.time).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
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
              <button key={Math.random()}>Chatt?</button>
              <button
                key={"Delete event" + evt.eventUid}
                value={evt.eventUid}
                index={evt.index}
                onClick={event => this.deleteEvent(event, index)}
              >
                Delete event
              </button>
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

/* import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";

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



  componentDidMount() {
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("hostedEvents")
      .on("value", snapshot => {
        const acceptedVal = snapshot.val();
        if (acceptedVal === null) {
          this.setState({
            noEvents: true
          });
        } else {
          this.setState({
            myEvents: []
          });
          const acceptedKeys = Object.keys(acceptedVal);
          const test = acceptedKeys.map(key => {
            this.props.firebase
              .events()
              .child(key)
              .on("value", snapshot => {
                const snap = snapshot.val();
                this.setState({
                  myEvents: [...this.state.myEvents, snap]
                });
              });
          });
        }
        this.setState({
          loading: false
        });
      });
  }


  deleteEvent(event) {
    const eventUid = event.target.value;
    const includedUid = [];
    const currentEventDate = [];
    const currentEventTime = [];
    const currentEventGroupRoom = [];

    this.props.firebase
      .events()
      .child(eventUid)
      .child("grouproom")
      .once("value", snapshot => {
        currentEventGroupRoom.push(snapshot.val());
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("time")
      .once("value", snapshot => {
        currentEventTime.push(Object.keys(snapshot.val()));
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("date")
      .once("value", snapshot => {
        currentEventDate.push(snapshot.val());
      });

    this.props.firebase
      .events()
      .child(eventUid)
      .child("isInvitedUid")
      .once("value", snapshot => {
        if (snapshot.val() === null) {
          return null;
        } else {
          includedUid.push(Object.keys(snapshot.val()));
        }
      });

    console.log(currentEventDate);
    console.log(currentEventGroupRoom);
    console.log(currentEventTime);
    console.log(includedUid);



        currentEventTime.map(slot => {
      this.props.firebase
        .bookedEventDateTimes()
        .child(currentEventGroupRoom)
        .child(currentEventDate)
        .child("time")
        .update({
          [slot]: null
        });
    });

    if (includedUid === null) {
      return null;
    } else {
      includedUid.map(inUid =>
        this.props.firebase
          .users(inUid)
          .child("invitedToEvents")
          .update({
            [eventUid]: null
          })
      );
    }

    if (includedUid === null) {
      return null;
    } else {
      includedUid.map(inUid =>
        this.props.firebase
          .users(inUid)
          .child("acceptedToEvents")
          .update({
            [eventUid]: null
          })
      );
    }

    this.props.firebase
      .users(this.props.authUser.uid)
      .child("hostedEvents")
      .update({
        [eventUid]: null
      });

    this.props.firebase
    .events()
    .update({
      [eventUid]: null
    });
  }

  render() {
    const { loading, myEvents, noEvents } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "No one is invited.";
    const noDeclined = "No one has declined yet.";
    const noTimes = "You have no times? WTF?";

    if (loading) {
      return (
        <div>
          Loading... <Spinner />
        </div>
      );
    } else if (noEvents) {
      return <div>You have no MyEvents</div>;
    } else {
      return (
        <section>
          {myEvents.map((evt, index) => (
            <InviteDiv key={"Div " + evt.eventUid}>
              <p key={"Host paragraph: " + evt.eventUid}>
                Host for this event: {evt.username}
              </p>
              <p key={"Date paragrah:" + evt.eventUid}>{evt.date}</p>
              <p key={"Event UID: " + evt.eventUid}>{evt.grouproom}</p>

              <ul>
                <li>Time:</li>

                {evt.time ? (
                  Object.keys(evt.time).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                    <li>{noTimes}</li>
                  )}
              </ul>
              <ul>
                <li>Is invited:</li>
                {evt.isInvited ? (
                  Object.keys(evt.isInvited).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                    <li>{noInvited}</li>
                  )}
              </ul>
              <ul>
                <li>Has accepted:</li>
                {evt.hasAccepted ? (
                  Object.keys(evt.hasAccepted).map((key, index) => (
                    <li key={index + evt.eventUid}>{key}</li>
                  ))
                ) : (
                    <li>{noAccepted}</li>
                  )}
              </ul>
              <ul>
                <li>Has declined:</li>
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
              <button key={Math.random()}>Chatt?</button>
              <button
                key={"Delete event" + evt.eventUid}
                value={evt.eventUid}
                index={evt.index}
                onClick={event => this.deleteEvent(event, index)}
              >
                Delete event
              </button>
            </InviteDiv>
          ))}
        </section>
      );
    }
  }
}

const condition = authUser => !!authUser;

const MyEventsComplete = withFirebase(MyEventsBase);

export default compose(withAuthorization(condition))(MyEvents); */
