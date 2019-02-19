import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div, GroupRoomButton } from "./styles";
import { AuthUserContext } from "../Session";
import DayPickerInput from "react-day-picker/DayPickerInput";
import * as ROLES from "../../constants/roles";
import "../../daypick.css";

import BookTime from "../BookTime";

import { withFirebase } from "../Firebase";

const BookRoom = () => (
  <Div>
    <h1>Book a room</h1>
    <AuthUserContext.Consumer>
      {authUser => <BookRoomForm authUser={authUser} />}
    </AuthUserContext.Consumer>
  </Div>
);
const bookableClassRooms = [
  "Classroom 510",
  "Classroom 511",
  "Classroom 604",
  "Classroom 609",
  "Classroom 610",
  "Classroom 611",
  "Classroom 612",
  "Classroom 613",
  "Classroom 614"
];
const bookableRooms = [
  "Group Room 605",
  "Group Room 606",
  "Group Room 607",
  "Group Room 608",
  "Corner Room"
];
class BookRoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showClassroomComponent: false,
      showGroupRoomComponent: false,
      showComponent: false,
      bookDate: new Date().toLocaleDateString()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit = event => {
    const { groupRoom, date, time } = this.state;

    this.props.firebase
      .groupRoom(this.props.authUser.uid)
      .set({
        groupRoom,
        date,
        time
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  handleChange(day) {
    this.setState({
      bookDate: day.toLocaleDateString()
    });
  }

  onChangeDisplayRoom(evt) {
    const showKey = evt.target.value;
    const hideKey = evt.target.hideRoom;
    /*     console.log("showKey:" + showKey + " hideKey: " + hideKey);
    console.log({ evt} ); */
    this.setState({
      [showKey]: true,
      [hideKey]: false
    });
  }

  // onChangeDisplayRoom = () => {
  //   this.setState(prevState => ({
  //     showClassroomComponent: !prevState.showClassroomComponent
  //   }));
  //   this.setState(prevState => ({
  //     showGroupRoomComponent: !prevState.showGroupRoomComponent
  //   }));
  // };

  closeTime = () => {
    this.setState(prevState => ({
      showComponent: !prevState.showComponent
    }));
  };

  onChange = event => {
    this.setState({
      groupRoom: event.target.name
    });
    this.setState({
      showComponent: true
    });
  };

  // TO DO:
  // Gör om de två knapparna till "Group Room" och "Classroom" med en onClick function som ändrar state .tex.
  // Classroom: true om man trycker på det samt Group Room: true  om man trycker på det.
  // Två knappar som är två komponenter.
  // Sedan passera props till komponenten.

  render() {
    const { authUser } = this.props;
    const { showClassroomComponent, showGroupRoomComponent } = this.state;
    return (
      <React.Fragment>
        <p>Please pick a date (press the current date):</p>
        <br />
        <DayPickerInput
          placeholder="Select Date"
          value={this.state.bookDate}
          onDayChange={day => this.handleChange(day)}
        />
        {authUser.roles.includes(ROLES.TEACHER) ||
        authUser.roles.includes(ROLES.ADMIN) ? (
          <Div>
            <button
              className="classRoom"
              name="classroom"
              value="showClassroomComponent"
              hideRoom="showGroupRoomComponent"
              onClick={evt => this.onChangeDisplayRoom(evt)}
            >
              Classrooms
            </button>

            <button
              className="classRoom"
              name="classroom"
              value="showGroupRoomComponent"
              hideRoom="showClassroomComponent"
              onClick={evt => this.onChangeDisplayRoom(evt)}
            >
              Group Rooms
            </button>

            {showGroupRoomComponent
              ? bookableRooms.map((room, index) => (
                  <GroupRoomButton
                    name={room}
                    key={index}
                    onClick={this.onChange}
                  >
                    {room}
                  </GroupRoomButton>
                ))
              : null}

            {showClassroomComponent
              ? bookableClassRooms.map((room, index) => (
                  <GroupRoomButton
                    name={room}
                    key={index}
                    onClick={this.onChange}
                  >
                    {room}
                  </GroupRoomButton>
                ))
              : null}
          </Div>
        ) : (
          <Div>
            {bookableRooms.map((room, index) => (
              <GroupRoomButton name={room} key={index} onClick={this.onChange}>
                {room}
              </GroupRoomButton>
            ))}
          </Div>
        )}

        {this.state.showComponent ? (
          <BookTime {...this.state} close={this.closeTime} />
        ) : null}
      </React.Fragment>
    );
  }
}

export const GroupRoomComponent = ({}) => (
  <Div>
    {bookableRooms.map((room, index) => (
      <GroupRoomButton name={room} key={index} onClick={this.onChange}>
        {room}
      </GroupRoomButton>
    ))}
  </Div>
);

const BookRoomForm = compose(
  withRouter,
  withFirebase
)(BookRoomBase);
export default BookRoom;
