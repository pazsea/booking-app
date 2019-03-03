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
                  this.setState(prevState => ({
                    active: [...prevState.active, key]
                  }));

                  /*                 this.setState({
                    active: key
                  }); */

                  // this.setState(prevState => ({
                  //   active: [...prevState.active], key

                  // }));
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

  attendEvent(evt) {
    const eventUid = evt.target.value;
    this.props.firebase
      .events()
      .child(eventUid)
      .child("attendees")
      .update({
        [this.props.authUser.username]: true
      });
  }

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
