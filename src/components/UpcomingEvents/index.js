import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";
import { compose } from "recompose";
import { HelpButton, NoHelpButton, H3 } from "./styles";

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

  componentDidMount() {
    const schoolLong = 18.110656;
    const schoolLat = 59.313215;

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
          snapKeys.forEach(eventUid => {
            this.props.firebase
              .events()
              .child(eventUid)
              .child("time")
              .once("value", snapshot => {
                const startTime = Number(Object.keys(snapshot.val()));
                const endTime = Number(Object.keys(snapshot.val())) + 3600000;

                if (startTime < Date.now() && endTime > Date.now()) {
                  // this.props.firebase
                  //   .events()
                  //   .child(eventUid)
                  //   .child("hasAcceptedUid")
                  //   .on("value", snapshot => {
                  //     const acceptedUid = Object.keys(snapshot.val());

                  //     acceptedUid.forEach(acceptUid => {
                  this.props.firebase
                    .users()
                    .child(this.props.authUser.uid)
                    .child("positions")
                    .limitToLast(1)
                    .on("value", snapshot => {
                      const lastKnownPositionObject = snapshot.val();

                      if (lastKnownPositionObject) {
                        const positionsList = Object.keys(
                          lastKnownPositionObject
                        ).map(positionsListKey => ({
                          ...lastKnownPositionObject[positionsListKey]
                        }));
                        let lastKnownPositions = {};
                        if (positionsList.length === 1) {
                          lastKnownPositions = Object.assign(positionsList[0]);
                        } else {
                          lastKnownPositions = Object.assign(positionsList);
                        }
                        const { latitude, longitude } = lastKnownPositions;

                        // const { latitude: lat1, longitude: lng1 } = position.coords;
                        // const { latitude: lat2, longitude: lng2 } = this.state.dbCoords;
                        const dist = this.calculateDistance(
                          latitude,
                          longitude,
                          schoolLat,
                          schoolLong
                        );
                        console.log(dist);
                        if (dist < 100) {
                          console.log(dist < 100);

                          this.props.firebase
                            .events()
                            .child(eventUid)
                            .child("attendees")
                            .update({
                              [this.props.authUser.username]: true
                            });
                          this.props.firebase
                            .events()
                            .child(eventUid)
                            .child("pending")
                            .update({
                              [this.props.authUser.username]: null
                            });
                        }
                        //   this.props.firebase
                        //     .events()
                        //     .child(key)
                        //     .child("absentees")
                        //     .update({
                        //       [this.props.authUser.username]: true
                        //     });
                      }
                    });
                  // });
                  // });
                } // else if (startTime > new Date()) {

                // }
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
    this.props.firebase.events().off();
  }

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return Math.round(d * 1000);
  };

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
