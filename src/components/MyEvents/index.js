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
        const acceptedKeys = Object.keys(snapshot.val());
        if (acceptedKeys == null) {
          this.setState({
            noEvents: true
          });
        } else {
          this.setState({
            myEvents: []
          });
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
            <InviteDiv key={Math.random()}>
              <p key={Math.random()}>Host for this event: {evt.username}</p>
              <p key={Math.random()}>{evt.date}</p>
              <p key={Math.random()}>{evt.grouproom}</p>

              <ul>
                <li>Time:</li>
                <li key={Math.random()} />
              </ul>
              <ul>
                <li>Is invited:</li>
                {evt.isInvited ? (
                  Object.keys(evt.isInvited).map(key => (
                    <li key={Math.random()}>{key}</li>
                  ))
                ) : (
                  <li>{noInvited}</li>
                )}
              </ul>
              <ul>
                <li>Has accepted:</li>
                {evt.hasAccepted ? (
                  Object.keys(evt.hasAccepted).map(key => (
                    <li key={Math.random()}>{key}</li>
                  ))
                ) : (
                  <li>{noAccepted}</li>
                )}
              </ul>
              <ul>
                <li>Has declined:</li>
                {evt.hasDeclined ? (
                  Object.keys(evt.hasDeclined).map(key => (
                    <li key={Math.random()}>{key}</li>
                  ))
                ) : (
                  <li>{noDeclined}</li>
                )}
              </ul>

              <input
                type="textarea"
                placeholder="Description"
                value={evt.description}
                key={Math.random()}
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
