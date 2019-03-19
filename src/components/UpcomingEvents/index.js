import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv, InfoDiv, InfoDiv2 } from "./styles";
import { compose } from "recompose";
import { HelpButton, NoHelpButton, H3 } from "./styles";
import { TitleOfSection } from "../MyEvents/styles";
import { KYHLocation } from "../MyEvents";
import { calculateDistance } from "../../utilities";

const UpcomingEvents = () => (
  <AuthUserContext.Consumer>
    {authUser => <UpcomingComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class UpcomingBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: [],
      loading: true,
      userEventObjects: [],
      noUpcoming: false
    };
  }

  toggleHelpQueue(evt) {
    const eventUid = evt.target.value;

    this.props.firebase
      .bookings()
      .child(eventUid)
      .child("helpQueue")
      .once("value", snapshot => {
        const snap = snapshot.val();
        if (snap === null) {
          console.log("snap was null");
          this.props.firebase
            .bookings()
            .child(eventUid)
            .child("helpQueue")
            .update({ [this.props.authUser.username]: true });
        } else {
          const snapKeys = Object.keys(snap);

          snapKeys.find(name => name === this.props.authUser.username)
            ? this.props.firebase
                .bookings()
                .child(eventUid)
                .child("helpQueue")
                .update({ [this.props.authUser.username]: null })
            : this.props.firebase
                .bookings()
                .child(eventUid)
                .child("helpQueue")
                .update({ [this.props.authUser.username]: true });
        }
      });
  }

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("acceptedTobookings")
      .once("value", snapshot => {
        const snap = snapshot.val();
        if (snap == null) {
          this.setState({
            noUpcoming: true
          });
        } else {
          this.setState({
            userEventObjects: [],
            noUpcoming: false
          });

          const snapKeys = Object.keys(snap);
          snapKeys.forEach(eventUid => {
            this.props.firebase
              .bookings()
              .child(eventUid)
              .child("time")
              .once("value", snapshot => {
                const startTime = Number(Object.keys(snapshot.val()));
                const endTime = Number(Object.keys(snapshot.val())) + 3600000;

                if (startTime < Date.now() && endTime > Date.now()) {
                  this.props.firebase
                    .users()
                    .child(this.props.authUser.uid)
                    .child("positions")
                    .limitToLast(1)
                    .on("value", snapshot => {
                      const lastKnownPosition = snapshot.val();

                      const dist = calculateDistance(
                        lastKnownPosition,
                        KYHLocation
                      );

                      if (dist < 100) {
                        console.log(dist < 100);

                        this.props.firebase
                          .bookings()
                          .child(eventUid)
                          .child("attendees")
                          .update({
                            [this.props.authUser.username]: true
                          });
                        this.props.firebase
                          .bookings()
                          .child(eventUid)
                          .child("hasAccepted")
                          .update({
                            [this.props.authUser.username]: null
                          });
                        this.props.firebase
                          .bookings()
                          .child(eventUid)
                          .child("hasAcceptedUid")
                          .update({
                            [this.props.authUser.uid]: null
                          });
                      }
                    });
                }
              });
          });

          snapKeys.forEach(key => {
            this.props.firebase.event(key).once("value", snapshot => {
              const eventObject = snapshot.val();
              this.setState({
                userEventObjects: [
                  ...this.state.userEventObjects,
                  { ...eventObject, uid: key }
                ]
              });
            });
          });
        }
        this.setState({
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
    this.props.firebase.bookings().off();
  }

  render() {
    const { loading, userEventObjects, noUpcoming } = this.state;
    const noAccepted = "";
    const noInvited = "";
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
    if (noUpcoming) {
      return <H3>You have no upcoming bookings at this time.</H3>;
    } else if (loading) {
      return (
        <div>
          Fetching upcoming bookings...
          <Spinner />
        </div>
      );
    } else {
      return (
        <section>
          <TitleOfSection>Upcoming</TitleOfSection>
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
                  <li> Status: </li>
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

                <HelpButton
                  value={eventUid}
                  key={"Help wanted: " + eventUid}
                  onClick={evt => this.toggleHelpQueue(evt)}
                  index={evt.index}
                >
                  Help queue
                </HelpButton>
                <NoHelpButton
                  value={eventUid}
                  key={"Dont need help: " + eventUid}
                  onClick={this.notNeeded}
                  index={evt.index}
                >
                  Cancel help queue
                </NoHelpButton>
              </InviteDiv>
            )
          )}
        </section>
      );
    }
  }
}

const UpcomingComplete = withFirebase(UpcomingBase);

const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(UpcomingEvents);
