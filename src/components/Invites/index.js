import React, { Component } from "react";
import { Spinner } from "react-mdl";
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
      userEventObjects: [],
      noInvites: false
    };
  }

  componentDidMount() {
    console.log("componen did mount start");

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap === null) {
          this.setState(prevState => ({
            noInvites: !prevState.noInvites
          }));
        } else {
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
                    userEventObjects: [
                      ...this.state.userEventObjects,
                      eventObject
                    ],
                    loading: false
                  });
                  /*                   console.log(this.state.userEventObjects); */
                }
              });
          });
        }
      });
    console.log("component did mount ENDS");
  }

  //TO DO:
  //the times must come in the right way. Right now its only Object Keys after Map..
  //ACCEPT FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasAccepted => currentUsername true
  //users/authuserUid/acceptedToEvent/ => currenteventID = true

  acceptInvite = event => {
    const currentEvent = event.target.value;
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("hasAccepted")
      .update({
        [this.props.authUser.username]: true
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvited")
      .update({
        [this.props.authUser.username]: null
      });
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .update({
        [currentEvent]: null
      });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("acceptedToEvent")
      .update({
        [currentEvent]: true
      });
  };

  //TO DO:
  //DECLINE FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasDeclined
  //*REMOVE* users/authuser.uid/invitedToEvents => currentEvent = null

  declineInvite = event => {
    const currentEvent = event.target.value;
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("hasDeclined")
      .update({
        [this.props.authUser.username]: true
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvited")
      .update({
        [this.props.authUser.username]: null
      });
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .update({
        [currentEvent]: null
      });
  };

  render() {
    const { loading, userEventObjects, noInvites } = this.state;
    {
      if (noInvites) {
        return <h3>You have no invites, looooser </h3>;
      } else if (loading) {
        return (
          <div>
            Loading....
            <Spinner />
          </div>
        );
      } else if (userEventObjects == null) {
        console.log(userEventObjects);
        return (
          <div>
            Fetching invites....
            <Spinner />
          </div>
        );
      } else {
        return (
          <section>
            {userEventObjects.map((evt, index) => (
              <InviteDiv>
                <p key={Math.random()}>
                  {evt.username} has invited you to this event:
                </p>
                <p key={Math.random()}>{evt.grouproom}</p>
                <p key={Math.random()}>{evt.date}</p>
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
                  key={Math.random()}
                  readOnly
                />
                <button
                  value={evt.eventUid}
                  key={Math.random()}
                  onClick={event => this.acceptInvite(event)}
                >
                  Accept
                </button>
                <button
                  key={Math.random()}
                  value={evt.eventUid}
                  onClick={event => this.declineInvite(event)}
                >
                  Decline
                </button>
              </InviteDiv>
            ))}
          </section>
        );
      }
    }
  }
}
const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);
