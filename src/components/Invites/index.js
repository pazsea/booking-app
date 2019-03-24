import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv, InfoDiv, InfoDiv2 } from "./styles";
import {
  NegativeButton,
  H3,
  TitleOfSection,
  PositiveButton
} from "../MyEvents/styles";

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

  /*
componentDidMount:

The componentDidMount takes in current invitations from the current signed in user. From that I mean it takes invitations from firebase and 
sets it to an local state.
*/

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("invitedToEvents")
      .on("value", snapshot => {
        const snap = snapshot.val();
        if (snap == null) {
          this.setState({
            noInvites: true
          });
        } else {
          this.setState({
            userEventObjects: [],
            noInvites: false
          });

          const snapKeys = Object.keys(snap);
          snapKeys.forEach(key => {
            this.props.firebase.event(key).on("value", snapshot => {
              const eventObject = snapshot.val();
              this.setState({
                userEventObjects: [
                  ...this.state.userEventObjects,
                  { ...eventObject, uid: key }
                ]
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

  componentWillUnmount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("invitedToEvents")
      .off();
    this.props.firebase.users().off();
    this.props.firebase.events().off();
  }

  /*
  acceptInvite():

  Lets say the signed in username is "MIMMI". When she accepts and invite we update firebase accordingly:

  -events
  --eventForTheInvitation UID
  ---hasAccepted:
  ----MIMMI: TRUE

  ---hasAcceptedUid:
  ----MIMMI's UID: True

  ---isInvited:
  ----MIMMI: null (disappears from firebase)


  -user
  --child(MIMMI UID)
  ---inviteToEvents:
  ----eventForTheInvitation UID: null

  ---hasAcceptedevents:
  ----eventForTheInvitation UID: true

  The event has Mimmi as accepted and Mimmi knows which event she has accepted.

  Hopefully it get clear of what this function actually does.
    
  */

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
      .child("hasAcceptedUid")
      .update({
        [this.props.authUser.uid]: true
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvited")
      .update({
        [this.props.authUser.username]: null
      });
    this.props.firebase
      .events()
      .child(currentEvent)
      .child("isInvitedUid")
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
      .child("acceptedToEvents")
      .update({
        [currentEvent]: true
      });

    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("invitedToEvents")
      .equalTo(currentEvent)
      .once("value", snapshot => {
        if (snapshot.val() === null) {
          delete userEventObjects[currentEvent];
          this.setState({ userEventObjects });
        } else {
          this.setState({
            loading: true
          });
        }
      });

    delete userEventObjects[index];
    this.setState({ userEventObjects });
  };

  /*
  declineInvite():

  This is the opposite of acceptInvite function but doesn somethings similar. Lets take the MIMMI approach from earlier.
  Lets say the signed in username is "MIMMI". When she declines an invite we update firebase accordingly:

  -events
  --eventForTheInvitation UID
  ---hasDeclined:
  ----MIMMI: TRUE

  ---isInvited:
  ----MIMMI: null (disappears from firebase)

  ---isInvitedUid:
  ----MIMMI's UID: null (disappears from firebase)


  -user
  --child(MIMMI UID)
  ---invitedToEvents:
  ----eventForTheInvitation UID: null (disappears from firebase)

  The event has Mimmi as declined and Mimmi dont need to know which event she has declined so we make it disappear from firebase.
  */

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
      .events()
      .child(currentEvent)
      .child("isInvitedUid")
      .update({
        [this.props.authUser.uid]: null
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
  };

  render() {
    const { loading, userEventObjects, noInvites } = this.state;
    const noAccepted = "";
    const noInvited = "No one is invited";
    const noDeclined = "";
    const noTimes = "You have no times";
    var pending = {
      color: "white"
    };
    var accept = {
      color: "#7bcd9f"
    };
    var decline = {
      color: "#ee8d80"
    };
    if (noInvites) {
      return <H3>You have no invites </H3>;
    } else if (loading) {
      return (
        <div>
          Loading....
          <Spinner />
        </div>
      );
    } else if (userEventObjects === null) {
      return (
        <div>
          Fetching invites....
          <Spinner />
        </div>
      );
    } else {
      return (
        <section>
          <TitleOfSection>Your Invitations</TitleOfSection>
          {userEventObjects.map(
            ({ eventUid, grouproom, date, hostName, time, ...evt }, index) => (
              <InviteDiv key={"Div " + eventUid}>
                <InfoDiv>
                  <p key={"Date paragrah: " + eventUid}>
                    Date: &nbsp;
                    {new Date(date).toLocaleDateString()}
                  </p>
                  <div>
                    {time ? (
                      Object.keys(time).map((key, index) => (
                        <p key={index + eventUid}>
                          Time: &nbsp;
                          {new Date(Number(key)).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}{" "}
                          {"- "}
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
                <InfoDiv2>
                  <p key={"Host paragraph: " + eventUid}>
                    Host: {hostName.charAt(0) + hostName.slice(1).toLowerCase()}
                  </p>
                  <p key={"Event UID: " + eventUid}>{grouproom}</p>
                </InfoDiv2>
                <ul>
                  <li>Invitees: </li>
                  {evt.isInvited ? (
                    Object.keys(evt.isInvited).map((key, index) => (
                      <li style={pending} key={index + eventUid}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                        <i className="fas fa-question" />
                      </li>
                    ))
                  ) : (
                    <li>{noInvited}</li>
                  )}
                </ul>
                <ul>
                  {evt.hasAccepted ? (
                    Object.keys(evt.hasAccepted).map((key, index) => (
                      <li style={accept} key={index + eventUid}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}
                        <i className="fas fa-check" />
                      </li>
                    ))
                  ) : (
                    <li>{noAccepted}</li>
                  )}
                </ul>
                <ul>
                  {evt.hasDeclined ? (
                    Object.keys(evt.hasDeclined).map((key, index) => (
                      <li style={decline} key={index + eventUid}>
                        {key.charAt(0) + key.slice(1).toLowerCase()}{" "}
                        <i className="fas fa-times" />
                      </li>
                    ))
                  ) : (
                    <li>{noDeclined}</li>
                  )}
                </ul>

                <input
                  type="textarea"
                  placeholder="Description"
                  value={evt.description}
                  key={"Description event: " + eventUid}
                  readOnly
                />
                <PositiveButton
                  value={eventUid}
                  key={"Button accept: " + eventUid}
                  index={evt.index}
                  onClick={event => this.acceptInvite(event, index)}
                >
                  Accept
                </PositiveButton>
                <NegativeButton
                  value={eventUid}
                  key={"Button decline: " + eventUid}
                  index={evt.index}
                  onClick={event => this.declineInvite(event, index)}
                >
                  Decline
                </NegativeButton>
              </InviteDiv>
            )
          )}
        </section>
      );
    }
  }
}
const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);
