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
    console.log("Component did Mount");
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap === null) {
          this.setState({
            noInvites: true
          });
          console.log("Hittade ingen snapshot i userns InvitedEvents");
        } else {
          console.log("Direkt efter else");
          /*           this.setState({
            userEventObjects: []
          });
          console.log("Rensade State userEventObjects till en tom Array"); */
          const snapKeys = Object.keys(snap);
          const test = snapKeys.map(key => {
            this.props.firebase
              .events()
              .child(key)
              .on("value", snapshot => {
                const eventObject = snapshot.val();
                this.setState({
                  userEventObjects: [
                    ...this.state.userEventObjects,
                    eventObject
                  ]
                });
                console.log("User Event object ska ha fått rätt events ");
              });
          });
        }
        this.setState({
          loading: false
        });
      });
    console.log("component did mount ENDS");
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
    this.props.firebase.events().off();
  }

  //TO DO:
  //the times must come in the right way. Right now its only Object Keys after Map..
  //ACCEPT FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasAccepted => currentUsername true
  //users/authuserUid/acceptedToEvent/ => currenteventID = true

  acceptInvite = (event, index) => {
    const currentEvent = event.target.value;
    const { userEventObjects } = this.state;
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

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .equalTo(currentEvent)
      .once("value", snapshot => {
        console.log(snapshot.val());
        if (snapshot.val() === null) {
          delete userEventObjects[currentEvent];
          this.setState({ userEventObjects });
        } else {
          console.log(snapshot.val());
          this.setState({
            loading: true
          });
        }
      });

    delete userEventObjects[index];
    this.setState({ userEventObjects });

    /*     const acceptArray = this.state.userEventObjects.findIndex(
      x => x === currentEvent
    );
    if (acceptArray > -1) {
      this.state.userEventObjects.splice(acceptArray, 1);
    }
    this.setState({
      userEventObjects: acceptArray
    }); */
  };

  //TO DO:
  //DECLINE FUNCTION:
  //events/eventUID/isInvited => currentUsername null
  //events/eventUID/hasDeclined
  //*REMOVE* users/authuser.uid/invitedToEvents => currentEvent = null

  declineInvite = (event, index) => {
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
    const { userEventObjects } = this.state;
    delete userEventObjects[index];
    this.setState({ userEventObjects });

    /*     const declineArray = this.state.userEventObjects.findIndex(
      x => x === index
    );
    if (declineArray > -1) {
      this.state.userEventObjects.splice(declineArray, 1);
    } */

    /*     deleteInvited = key => {
      const { isInvited, isInvitedUid } = this.state;
      delete isInvited[key];
      this.setState({ isInvited });

      this.props.firebase
        .users()
        .orderByChild("username")
        .equalTo(key)
        .once("child_added", function (snapshot) {
          const key = snapshot.key;
          const indexKey = isInvitedUid.findIndex(x => x === key);
          if (indexKey > -1) {
            isInvitedUid.splice(indexKey, 1);
          }
        });
    }; */
  };

  render() {
    console.log("RENDER");
    const { loading, userEventObjects, noInvites } = this.state;
    const noAccepted = "No one has accepted yet.";
    const noInvited = "No one is invited.";
    const noDeclined = "No one has declined yet.";
    const noTimes = "You have no times? WTF?";

    if (noInvites) {
      return <h3>You have no invites, looooser </h3>;
    } else if (loading) {
      return (
        <div>
          Loading....
          <Spinner />
        </div>
      );
    } else if (userEventObjects === null) {
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
            <InviteDiv key={"Div " + evt.eventUid}>
              <p key={"Host paragraph: " + evt.eventUid}>
                {evt.username} has invited you to this event:
              </p>
              <p key={"Event UID: " + evt.eventUid}>{evt.grouproom}</p>
              <p key={"Date paragrah:" + evt.eventUid}>{evt.date}</p>
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
              <button
                value={evt.eventUid}
                key={"Button accept: " + evt.eventUid}
                index={evt.index}
                onClick={event => this.acceptInvite(event, index)}
              >
                Accept
              </button>
              <button
                value={evt.eventUid}
                key={"Button decline: " + evt.eventUid}
                index={evt.index}
                onClick={event => this.declineInvite(event, index)}
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
const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);
