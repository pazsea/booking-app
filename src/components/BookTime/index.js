import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { animateScroll as scroll } from "react-scroll";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import {
  Form,
  CustomButton,
  CustomButton2,
  TimeSlotBtn,
  LoadingDiv,
  AnimationDivConfirmed,
  CorrectionDiv,
  CloseButton,
  TopButton
} from "./styles";
import "./module.css";

import "react-mdl/extra/material.css";
import "react-mdl/extra/material.js";

const scrollToTop = scroll.scrollToTop;

const BookTime = props => (
  <div>
    <BookTimeComplete {...props} />
  </div>
);

const times = [
  "25200000",
  "28800000",
  "32400000",
  "36000000",
  "39600000",
  "43200000",
  "46800000",
  "50400000",
  "54000000",
  "57600000"
];

class BookTimeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingDate: new Date(this.props.bookDate).toDateString(),
      time: {},
      chosenTimeSlots: {},
      loading: false,
      dbUsernames: [],
      isInvited: {},
      isInvitedUid: [],
      description: "",
      showModal: false
    };
    this.timer = null;
  }

  updateBookedTimeSlots = () => {
    const { firebase, groupRoom } = this.props;

    firebase
      .bookedEventDateTimes()
      .child(groupRoom)
      .on("value", snapshot => {
        const bookedObject = snapshot.val();
        if (bookedObject) {
          const bookedList = bookedObject;
          this.setState({ time: bookedList, loading: false });
          this.setState({ chosenTimeSlots: {} });
        } else {
          this.setState({ time: {}, loading: false });
        }
      });
  };

  componentDidMount() {
    const { firebase } = this.props;
    this.updateBookedTimeSlots();

    this.setState({ loading: true });
    firebase.users().on("value", snapshot => {
      const userObj = Object.values(snapshot.val());
      const map1 = userObj.map(function(userO) {
        return userO.username;
      });
      this.setState({ mapeusernames: map1, loading: false });
    });
  }

  componentDidUpdate(prevProps) {
    const { groupRoom, bookDate } = this.props;

    if (groupRoom !== prevProps.groupRoom || bookDate !== prevProps.bookDate) {
      this.setState({ loading: true });
      this.updateBookedTimeSlots();
    }
  }

  componentWillUnmount() {
    const { firebase, groupRoom, bookDate } = this.props;

    firebase
      .bookedEventDateTimes()
      .child(groupRoom)
      .child(bookDate)
      .off();
    firebase.users().off();
  }

  onClickTimeSlot = name => {
    const { chosenTimeSlots } = this.state;
    if (chosenTimeSlots[name]) {
      this.setState({
        chosenTimeSlots: {
          [name]: null
        }
      });
    } else {
      this.setState(prevState => ({
        chosenTimeSlots: {
          ...prevState.chosenTimeSlots,
          [name]: !prevState.chosenTimeSlots[name]
        }
      }));
    }
  };

  getValueInput(evt) {
    const inputValue = evt.target.value;
    this.filterNames(inputValue);
  }

  filterNames(inputValue) {
    const { mapeusernames } = this.state;
    const inputeValueUpper = inputValue.toUpperCase();
    if (inputValue.length === 0) {
      this.setState({ dbUsernames: [] });
    } else {
      this.setState({
        dbUsernames: mapeusernames.filter(usernames =>
          usernames.includes(inputeValueUpper)
        )
      });
    }
  }

  pushToInvited = (event, user) => {
    const { firebase } = this.props;
    const { isInvited } = this.state;

    const invitees = Object.keys(isInvited);
    if (invitees.length === 0 || !invitees.includes(user)) {
      isInvited[user] = true;
      this.setState({ isInvited });

      firebase
        .users()
        .orderByChild("username")
        .equalTo(user)
        .once("child_added", snapshot => {
          const key = snapshot.key;
          this.setState(prevState => ({
            isInvitedUid: [...prevState.isInvitedUid, key]
          }));
        });
      event.preventDefault();
    } else {
      alert("User already booked");
      event.preventDefault();
    }
  };

  updateDescription(event) {
    this.setState({ description: event.target.value });
  }

  closeModule = () => {
    this.setState({
      showModal: false
    });
    this.timer = setTimeout(this.showContent.bind(this), 3000);
  };

  deleteInvited = key => {
    const { firebase } = this.props;
    const { isInvited, isInvitedUid } = this.state;
    delete isInvited[key];
    this.setState({ isInvited });

    firebase
      .users()
      .orderByChild("username")
      .equalTo(key)
      .once("child_added", function(snapshot) {
        const key = snapshot.key;
        const indexKey = isInvitedUid.findIndex(x => x === key);
        if (indexKey > -1) {
          isInvitedUid.splice(indexKey, 1);
        }
      });
  };

  sendToDB = (event, authUser) => {
    const { firebase, groupRoom, bookDate } = this.props;
    const {
      isInvited,
      isInvitedUid,
      chosenTimeSlots,
      time,
      description
    } = this.state;
    if (Object.keys(chosenTimeSlots).length) {
      const newObj = Object.assign({}, { ...time }, { ...chosenTimeSlots });

      firebase
        .bookedEventDateTimes()
        .child(groupRoom)
        .set({ ...newObj });

      const eventKey = firebase.events().push().key;

      const mapInviteUid = isInvitedUid;

      mapInviteUid.map(inviteUid =>
        firebase
          .users()
          .child(inviteUid)
          .child("invitedToEvents")
          .update({ [eventKey]: true })
      );

      mapInviteUid.map(inviteUid =>
        firebase
          .events()
          .child(eventKey)
          .child("isInvitedUid")
          .update({ [inviteUid]: true })
      );

      firebase
        .events()
        .child(eventKey)
        .update({
          grouproom: groupRoom,
          date: bookDate,
          hostID: authUser.uid,
          hostName: authUser.username,
          time: { ...chosenTimeSlots },
          isInvited: { ...isInvited },
          description: description,
          eventUid: eventKey
        });

      firebase
        .users()
        .child(authUser.uid)
        .child("hostedEvents")
        .update({ [eventKey]: true });

      this.setState({
        isInvited: {},
        description: "",
        dbUsername: [],
        isInvitedUid: []
      });
      this.setState({
        showModal: true
      });
    } else {
      alert("You haven't booked any time slots for you event");
      event.preventDefault();
    }

    event.preventDefault();
  };

  render() {
    const { close, groupRoom, bookDate } = this.props;
    const {
      loading,
      dbUsernames,
      showModal,
      bookingDate,
      isInvited,
      chosenTimeSlots,
      description
    } = this.state;

    const isInvitedKeys = Object.keys(isInvited);

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {loading ? (
              <LoadingDiv>
                Loading ...
                <Spinner singleColor />
              </LoadingDiv>
            ) : (
              <Form>
                <CloseButton onClick={close}>Close</CloseButton>
                <br />
                <h2>
                  Date: <p>{bookingDate}</p>
                </h2>
                <h2>
                  Room: <p>{groupRoom}</p>
                </h2>
                <br />
                {times
                  .map(time => parseInt(time) + parseInt(bookDate))
                  .filter(time => !this.state.time[time])
                  .map(time => (
                    <TimeSlot
                      key={time}
                      name={time}
                      time={time}
                      chosenTimeSlots={chosenTimeSlots}
                      onClickTimeSlot={this.onClickTimeSlot}
                    />
                  ))}

                <label>
                  <br />
                  <h4>Invite user:</h4>

                  {dbUsernames
                    .filter(user => user.length > 0)
                    .map(user => (
                      <CustomButton2
                        name={user}
                        key={user}
                        onClick={event => this.pushToInvited(event, user)}
                      >
                        {user}
                      </CustomButton2>
                    ))}

                  <input
                    id="searchUser"
                    type="text"
                    name="name"
                    placeholder="Search for users to invite."
                    onChange={evt => this.getValueInput(evt)}
                  />
                </label>
                <h4>Uninvite user:</h4>
                {isInvitedKeys.map(key => (
                  <CustomButton
                    name={key}
                    key={key}
                    onClick={() => this.deleteInvited(key)}
                  >
                    {key}
                  </CustomButton>
                ))}
                <br />
                <br />
                <textarea
                  id="descriptionInput"
                  type="textarea"
                  name="description"
                  value={description}
                  placeholder="Write a short description what the booking is about"
                  onChange={event => this.updateDescription(event)}
                />
                <br />
                <input
                  className="sendButton"
                  type="submit"
                  value="Book room"
                  onClick={event => this.sendToDB(event, authUser)}
                />
                {showModal ? (
                  <div
                    className="modal display-block"
                    onClick={this.closeModule}
                  >
                    <section className="modal-main">
                      <AnimationDivConfirmed>
                        <CorrectionDiv>
                          Room booked!
                          <i className="fas fa-check-circle fa-3x" />
                        </CorrectionDiv>
                      </AnimationDivConfirmed>
                    </section>
                  </div>
                ) : (
                  <div className="modal display-none">
                    <section className="modal-main" />
                  </div>
                )}
              </Form>
            )}
            <TopButton onClick={scrollToTop}>To the top!</TopButton>
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export const TimeSlot = ({ name, onClickTimeSlot, chosenTimeSlots }) => {
  const timeSlotStart = new Date(name).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  const timeSlotEnd = new Date(name + 3600000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <React.Fragment>
      <TimeSlotBtn
        className={chosenTimeSlots[name] ? "chosenTimeSlot" : ""}
        onClick={e => {
          onClickTimeSlot(name);
          e.preventDefault();
        }}
      >
        {timeSlotStart} - {timeSlotEnd}
      </TimeSlotBtn>
    </React.Fragment>
  );
};

const condition = authUser => !!authUser;

const BookTimeComplete = withFirebase(BookTimeBase);

export default compose(withAuthorization(condition))(BookTime);
