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
              <button key={Math.random()}>placeholder</button>
              <button key={Math.random()}>Delete event</button>
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
