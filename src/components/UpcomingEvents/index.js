import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";
import { MyEventsButton, AttendEventButton } from "./styles";
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
    // this.props.firebase
    //   .events()
    //   .child("-L_6qq9KMkNOrb4lcN9I")
    //   .child("hasAcceptedUid")
    //   .on("value", snapshot => {
    //     const acceptedUid = Object.keys(snapshot.val());
    //     console.log(acceptedUid);
    // acceptedUid.forEach(acceptUid => {
    //   this.props.firebase
    //     .users()
    //     .child(acceptUid)
    //     .child("positions")
    //     .limitToLast(1)
    //     .on("value", snapshot => {
    // console.log(snapshot.val());

    // const { latitude, longitude } = snapshot.val();
    // console.log(latitude);
    // console.log(longitude);
    // const lastKnownPositionObject = snapshot.val();

    // if (lastKnownPositionObject) {
    //   const positionsList = Object.keys(lastKnownPositionObject).map(
    //     key => ({
    //       ...lastKnownPositionObject[key]
    //     })
    //   );
    //   let lastKnownPositions = {};
    //   if (positionsList.length === 1) {
    //     lastKnownPositions = Object.assign(positionsList[0]);
    //   } else {
    //     lastKnownPositions = Object.assign(positionsList);
    //   }
    //   const { latitude, longitude } = lastKnownPositions;
    // }

    // const schoolNorth = "59.313544";
    // const schoolSouth = "59.312755";

    // const schoolWest = "18.109941";
    // const schoolEast = "18.111293";

    // if (
    //   latitude > schoolSouth &&
    //   latitude < schoolNorth &&
    //   longitude > schoolWest &&
    //   longitude < schoolEast
    // ) {
    //   console.log("DU KOM EFTER DIN COOL IF SATS");
    //   this.props.firebase
    //     .events()
    //     .child("-L_6qq9KMkNOrb4lcN9I")
    //     .child("attendees")
    //     .update({
    //       [this.props.authUser.username]: true
    //     });
    // } else {
    //   return null;
    // }
    //       });
    //   });
    // });

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
              .on("value", snapshot => {
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

  /*   attendEvent(evt) {
    const eventUid = evt.target.value;
    this.props.firebase
      .events()
      .child(eventUid)
      .child("attendees")
      .update({
        [this.props.authUser.username]: true
      });
  } */

  render() {
    const { loading, userEventObjects, noUpcoming } = this.state;
    const noTimes = "You have no times? WTF?";

    if (noUpcoming) {
      return <h3>You have no upcoming events at this time.</h3>;
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
                <MyEventsButton
                  value={eventUid}
                  key={"Dont need help: " + eventUid}
                  onClick={this.notNeeded}
                  index={evt.index}
                >
                  Dont need help anymore.
                </MyEventsButton>
                <MyEventsButton
                  value={eventUid}
                  key={"Help wanted: " + eventUid}
                  index={evt.index}
                  onClick={this.helpMe}
                >
                  Oh God, Help me!!
                </MyEventsButton>
                <AttendEventButton
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
                </AttendEventButton>
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
