import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";
import { HelpButton, NoHelpButton, AttendEventButton, H3 } from "./styles";
import { hostname } from "os";

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
      noUpcoming: false,
      active: []
    };
  }

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("acceptedToEvents")
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
          snapKeys.forEach(key => {
            this.props.firebase
              .events()
              .child(key)
              .child("time")
              .once("value", snapshot => {
                const startTime = Number(Object.keys(snapshot.val()));
                const endTime = Number(Object.keys(snapshot.val())) + 3600000;

                if (startTime < Date.now() && endTime > Date.now()) {
                  this.props.firebase
                    .events()
                    .child(key)
                    .child("hasAcceptedUid")
                    .on("value", snapshot => {
                      const acceptedUid = Object.keys(snapshot.val());
                      acceptedUid.forEach(acceptUid => {
                        this.props.firebase
                          .users()
                          .child(acceptUid)
                          .child("positions")
                          .limitToLast(1)
                          .on("value", snapshot => {
                            const lastKnownPositionObject = snapshot.val();

                            if (lastKnownPositionObject) {
                              const positionsList = Object.keys(
                                lastKnownPositionObject
                              ).map(key => ({
                                ...lastKnownPositionObject[key]
                              }));
                              let lastKnownPositions = {};
                              if (positionsList.length === 1) {
                                lastKnownPositions = Object.assign(
                                  positionsList[0]
                                );
                              } else {
                                lastKnownPositions = Object.assign(
                                  positionsList
                                );
                              }
                              const {
                                latitude,
                                longitude
                              } = lastKnownPositions;

                              const schoolNorth = "59.313544";
                              const schoolSouth = "59.312755";

                              const schoolWest = "18.109941";
                              const schoolEast = "18.111293";

                              if (
                                latitude > schoolSouth &&
                                latitude < schoolNorth &&
                                longitude > schoolWest &&
                                longitude < schoolEast
                              ) {
                                this.props.firebase
                                  .events()
                                  .child(key)
                                  .child("attendees")
                                  .update({
                                    [this.props.authUser.username]: true
                                  });
                              }
                            }
                          });
                      });
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
    this.props.firebase.user().off();
    this.props.firebase.event().off();
  }

  toggleHelpQueue(evt) {
    const eventUid = evt.target.value;

    this.props.firebase
      .events()
      .child(eventUid)
      .child("helpQueue")
      .once("value", snapshot => {
        const snap = snapshot.val();
        if (snap === null) {
          console.log("snap was null");
          this.props.firebase
            .events()
            .child(eventUid)
            .child("helpQueue")
            .update({ [this.props.authUser.username]: true });
        } else {
          const snapKeys = Object.keys(snap);

          snapKeys.find(name => name === this.props.authUser.username)
            ? this.props.firebase
                .events()
                .child(eventUid)
                .child("helpQueue")
                .update({ [this.props.authUser.username]: null })
            : this.props.firebase
                .events()
                .child(eventUid)
                .child("helpQueue")
                .update({ [this.props.authUser.username]: true });
        }
      });
  }

  render() {
    const { loading, userEventObjects, noUpcoming } = this.state;
    const noTimes = "You have no times? WTF?";

    if (noUpcoming) {
      return <H3>You have no upcoming events at this time.</H3>;
    } else if (loading) {
      return (
        <div>
          Fetching upcoming events...
          <Spinner />
        </div>
      );
    } else {
      const { active } = this.state;
      return (
        <section>
          {userEventObjects.map(
            ({ eventUid, grouproom, date, hostName, time, ...evt }, index) => (
              <InviteDiv key={"Div " + eventUid} {...this.state}>
                <p key={"Host paragraph: " + eventUid}>Hosted by: {hostName}</p>
                <p key={"Event UID: " + eventUid}>{grouproom}</p>
                <p key={"Date paragrah:" + eventUid}>
                  {new Date(date).toLocaleDateString()}
                </p>
                <ul>
                  <li>Time: </li>

                  {time ? (
                    Object.keys(time).map((key, index) => (
                      <li key={index + eventUid}>
                        {new Date(Number(key)).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}{" "}
                        -{" "}
                        {new Date(Number(key) + 3600000).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                      </li>
                    ))
                  ) : (
                    <li>{noTimes}</li>
                  )}
                </ul>
                <HelpButton
                  value={eventUid}
                  key={"Help wanted: " + eventUid}
                  key={"Dont need help: " + eventUid}
                  onClick={evt => this.toggleHelpQueue(evt)}
                  index={evt.index}
                  onClick={this.helpMe}
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

                {/* <AttendEventButton
                  className={
                    Object.values(active).find(
                      bookingId => bookingId === eventUid
                    )
                      ? "activeButton"
                      : ""
                    // active === eventUid ? "activeButton" : ""
                  }
                  value={eventUid}
                  key={"Attend: " + eventUid}
                  index={evt.index}
                  onClick={evt =>
                    eventUid === active ? this.attendEvent(evt) : null
                  }
                >
                  ATTEND
                </AttendEventButton> */}
              </InviteDiv>
            )
          )}
        </section>
      );
    }
  }
}

const UpcomingComplete = withFirebase(UpcomingBase);

export default UpcomingEvents;
