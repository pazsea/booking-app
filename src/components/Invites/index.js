import React, { Component } from "react";
/* import { Spinner } from "react-mdl"; */
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";

const Invites = () => (
  <AuthUserContext.Consumer>
    {authUser => <InvitesComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class InvitesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: [],
      loading: true,
      userEventObjects: []
    };
  }

  //Vi behöver kolla upp inloggade användarens invitedToEvents
  //Behöver vi skanna hela events listan för rätt event och sedan spara i state.
  //Där renderar vi date, time, userinvited, description i en div
  // En funktion där vi accepterar eller declinar, vilket för en ny firebase path i event UID.

  componentDidMount() {
    const usersInvitedEventsList = Object.keys(
      this.props.authUser.invitedToEvents
    );

    const test = usersInvitedEventsList.map(key => {
      this.props.firebase
        .events()
        .child(key)
        .on("value", snapshot => {
          const eventObject = snapshot.val();

          if (eventObject) {
            this.setState({
              userEventObjects: [...this.state.userEventObjects, eventObject],
              loading: false
            });
            console.log(this.state.userEventObjects);
          }
        });
    });
  }
  render() {
    const { loading, userEventObjects } = this.state;
    return (
      <section>
        {userEventObjects.map((evt, index) => (
          <InviteDiv>
            <p key={index}>{evt.username} has invited you to this event:</p>
            <p key={index}>{evt.grouproom}</p>
            <p key={index}>{evt.date}</p>
            <ul>
              <li>Time:</li>
              <li>
                {Object.keys(evt.time).filter(function(key) {
                  return evt.time[key];
                })}
              </li>
            </ul>
            <ul>
              <li>Is invited:</li>
              <li>{Object.keys(evt.isInvited)}</li>
            </ul>
            <ul>
              <li>Has accepted:</li>
            </ul>
            <ul>
              <li>Has declined:</li>
            </ul>

            <input
              type="textarea"
              placeholder="Description"
              key={index}
              value={evt.description}
              readOnly
            />
            <button>Accept</button>
            <button>Decline</button>
          </InviteDiv>
        ))}
      </section>
    );
  }
}

var obj = { 1001: true, 1002: false };

var keys = Object.keys(obj);

var filtered = keys.filter(function(key) {
  return obj[key];
});

{
  /* <li key={index}>{evt.description}</li> */
}

const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);
