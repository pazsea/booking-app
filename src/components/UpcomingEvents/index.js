import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { InviteDiv } from "./styles";

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
    console.log("Upcoming did mount");
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("acceptedToEvents")
      .on("value", snapshot => {
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
      return (
        <section>
          {userEventObjects.map(
            ({ eventUid, grouproom, date, username, time, ...evt }, index) => (
              <InviteDiv key={"Div " + eventUid}>
                <p key={"Host paragraph: " + eventUid}>Hosted by: {username}</p>
                <p key={"Event UID: " + eventUid}>{grouproom}</p>
                <p key={"Date paragrah:" + eventUid}>{date}</p>
                <ul>
                  <li>Time: </li>

                  {time ? (
                    Object.keys(time).map((key, index) => (
                      <li key={index + eventUid}>{key}</li>
                    ))
                  ) : (
                    <li>{noTimes}</li>
                  )}
                </ul>

                <button
                  value={eventUid}
                  key={"Button accept: " + eventUid}
                  index={evt.index}
                >
                  Attend
                </button>
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
