import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { animateScroll as scroll } from "react-scroll";
import "./module.css";
import "react-mdl/extra/material.css";
import "react-mdl/extra/material.js";
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

const scrollToTop = scroll.scrollToTop;

const BookTime = props => (
  <div>
    <BookTimeComplete {...props} />
  </div>
);

/*
const times: 
 
is a variable with numeric dates for the time slots. We add them together with the current date an user has picked. 
Together we get the precise numerice date for chosen date and timeslot 
*/

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

  /* 
  updateBookedTimeSlots = ():
  
  This function updates Book Time component to display all time slots that aren't booked.
  This functions runs in ComponendDidMount lifecycle. 
  */

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

  /* 
   ComponentDidMount: 

   The ComponentDidMount runs updateBookedTimeSlots first as i described in the comment above.
   But it also takes in all registered users in the database. 
  */

  componentDidMount() {
    const { firebase } = this.props;
    this.updateBookedTimeSlots();

    this.setState({ loading: true });
    firebase.users().on("value", snapshot => {
      const userObj = Object.values(snapshot.val());
      const map1 = userObj.map(function(userO) {
        return userO.username;
      });
      this.setState({ mapUsernames: map1, loading: false });
    });
  }

  /*
  ComponentDidUpdate:

  If an user changes the grouproom or date the updateBookedTimeSlots runs again to display the free rooms during the new date or room.
  */

  componentDidUpdate(prevProps) {
    const { groupRoom, bookDate } = this.props;

    if (groupRoom !== prevProps.groupRoom || bookDate !== prevProps.bookDate) {
      this.setState({ loading: true });
      this.updateBookedTimeSlots();
    }
  }

  componentWillUnmount() {
    const { firebase, groupRoom } = this.props;
    firebase
      .bookedEventDateTimes()
      .child(groupRoom)
      .off();
    firebase.users().off();
  }

  /* 
  onClickTimeSlot():
  
  Here we insert in the chosen timeslot that the user has picked and put it in a state. We also sets the picked timeslot to null if you
  unselect it. And because Firebase never takes in timeslots with Null as its value, it is safe to push to firebase.
  */

  onClickTimeSlot = name => {
    const { chosenTimeSlots } = this.state;
    if (chosenTimeSlots[name]) {
      this.setState(prevState => ({
        chosenTimeSlots: {
          ...prevState.chosenTimeSlots,
          [name]: null
        }
      }));
    } else {
      this.setState(prevState => ({
        chosenTimeSlots: {
          ...prevState.chosenTimeSlots,
          [name]: !prevState.chosenTimeSlots[name]
        }
      }));
    }
  };

  /*
  getValueInput() and filterNames():

  We took in all registered users from firebase in the ComponentDidMount lifecycle. Here is the function where the user searches for the user
  he/she wants to invite. In getValueInput we take in what the User is writing and passes it as an argument to the filterNames function. There
  we do as the function describes. ie filterNames from mapUsernames state.
  */

  getValueInput(evt) {
    const inputValue = evt.target.value;
    this.filterNames(inputValue);
  }

  filterNames(inputValue) {
    const { mapUsernames } = this.state;
    const inputeValueUpper = inputValue.toUpperCase();
    if (inputValue.length === 0) {
      this.setState({ dbUsernames: [] });
    } else {
      this.setState({
        dbUsernames: mapUsernames.filter(usernames =>
          usernames.includes(inputeValueUpper)
        )
      });
    }
  }

  /*
  pushToInvited():

  When an signed in user finds the username he/she wants to invite. The signed in user can click on a button where the choosen username is displayed. 
  When an username is picked we set his or hers Username (ie "MIMMI") in isInvited state but we also look in firebase for that usernames
  uid and set that uid to isInvitedUid state.
  If the signed in user doesnt unselect a username this will eventually be sent to firebase along the booked timeslot.
  */

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
      alert("User already selected for invite");
      event.preventDefault();
    }
  };

  /*
  updateDescription(event):
  
  Sets description of the event as an description state.
  */

  updateDescription(event) {
    this.setState({ description: event.target.value });
  }

  closeModule = () => {
    this.setState({
      showModal: false
    });
  };

  /*
  deleteInvited():
  
  This function unselects a user from you already selected invite list.
  */

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

  /*
  sendToDB():

  This is the motherload of functions. When the user has decided on date, room, timeslots, description then this is the function where the
  user actually books the timeslot and invites all concerned people. This will push all the things I mentioned to firebase.
  */

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

      const timeList = Object.keys(chosenTimeSlots);
      let bookingStartTime = parseInt(timeList[0]);
      let bookingStartTimeETA = bookingStartTime - 3600000;
      let bookingEndTime = bookingStartTime + 3600000;

      firebase
        .events()
        .child(eventKey)
        .update({
          grouproom: groupRoom,
          date: bookDate,
          hostID: authUser.uid,
          hostName: authUser.username,
          time: { ...chosenTimeSlots },
          startTime: bookingStartTime,
          startTimeETA: bookingStartTimeETA,
          endTime: bookingEndTime,
          isInvited: { ...isInvited },
          description: description,
          eventUid: eventKey
        });

      mapInviteUid.map(inviteUid =>
        firebase
          .events()
          .child(eventKey)
          .child("isInvitedUid")
          .update({ [inviteUid]: true })
      );

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
                {/*
                The times variable (below) actually gets mapped here.
                For each hard coded timeslot we actually add the choosen numeric value of the picked date.
                Then filter all slots that are already booked.
                Then we map it again (yea, thats right! Awesome, no? :)) and return the Timeslot component which is the timeslot 
                for each available slot on the picked date.
                */}
                {times
                  .map(time => parseInt(time) + parseInt(bookDate))
                  .filter(time => !this.state.time[time])
                  .map(time => (
                    <TimeSlot
                      key={time}
                      timeSlot={time}
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

/* 
const TimeSlot():

Timeslot takes in the numeric value of the picked date added with the hard coded numeric value of the times variable. 
(check the map=>filter=>map function comment in the render method for more info).
We display it as Hour and Minute only.
*/

export const TimeSlot = ({ timeSlot, onClickTimeSlot, chosenTimeSlots }) => {
  const timeSlotStart = new Date(timeSlot).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
  const timeSlotEnd = new Date(timeSlot + 3600000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <React.Fragment>
      <TimeSlotBtn
        className={chosenTimeSlots[timeSlot] ? "chosenTimeSlot" : ""}
        onClick={e => {
          onClickTimeSlot(timeSlot);
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
