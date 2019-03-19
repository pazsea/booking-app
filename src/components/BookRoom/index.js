import React, { Component } from "react";
import { Link, Element } from "react-scroll";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div, GroupRoomButton, ClassroomButton } from "./styles";
import { AuthUserContext, withAuthorization } from "../Session";
import DayPickerInput from "react-day-picker/DayPickerInput";
import * as ROLES from "../../constants/roles";
import "../../daypick.css";

import BookTime from "../BookTime";

import { withFirebase } from "../Firebase";

const BookRoom = () => (
  <Div>
    <h1>Book A Room</h1>
    <AuthUserContext.Consumer>
      {authUser => <BookRoomForm authUser={authUser} />}
    </AuthUserContext.Consumer>
  </Div>
);

/*
const bookableClassRooms:

Here we have variables for the classrooms and grouprooms that KYH school has available for booking.
*/

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
      showTimeComponent: false,
      showClassroomComponent: false,
      showGroupRoomComponent: false,
      bookDate: new Date().setHours(0, 0, 0, 0),
      currentDate: new Date().toLocaleDateString()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /* 
  handleChange(day):

  Selected date in daypicker get set to state as hours.
  */

  handleChange(day) {
    this.setState({
      bookDate: day.setHours(0, 0, 0, 0)
    });

    this.setState({
      currentDate: day
    });
  }

  /*
  onChangeDisplayClassroom(evt):

  Function that sets the specific classroom to state.
  */

  onChangeDisplayClassroom(evt) {
    const { showGroupRoomComponent } = this.state;
    const showKey = evt.target.value;
    this.setState(prevState => ({
      [showKey]: !prevState[showKey]
    }));

    if (showGroupRoomComponent) {
      this.setState(prevState => ({
        showGroupRoomComponent: !prevState.showGroupRoomComponent
      }));
    }
  }

  /* 
  onChangeDisplayGroupRoom(evt):
  
  Function that sets the specific grouproom to state.
  */

  onChangeDisplayGroupRoom(evt) {
    const { showClassroomComponent } = this.state;
    const showKey = evt.target.value;
    this.setState(prevState => ({
      [showKey]: !prevState[showKey]
    }));

    if (showClassroomComponent) {
      this.setState(prevState => ({
        showClassroomComponent: !prevState.showClassroomComponent
      }));
    }
  }

  /*
  closeTime():

  closes the booktime component if open.
  */

  closeTime = () => {
    this.setState(prevState => ({
      showTimeComponent: !prevState.showTimeComponent
    }));
  };

  onChange = event => {
    this.setState({
      groupRoom: event.target.name,
      showTimeComponent: true
    });
    this.setState({
      showClassroomComponent: false,
      showGroupRoomComponent: false
    });
  };

  /*
  render():

  Our render has an condition that need to be meet. If the user inhabit the role of TEACHER or ADMIN, 
  it will show some buttons available for admins and teachers. But if you are STUDENT or just a plain Auth User, 
  you only will only see the grouproom buttons. 
  */

  render() {
    const { authUser } = this.props;
    const { showGroupRoomComponent, showClassroomComponent } = this.state;
    return (
      <React.Fragment>
        <p>Please pick a date (press the current date):</p>
        <br />
        <DayPickerInput
          placeholder="Select Date"
          value={this.state.currentDate}
          onDayChange={day => this.handleChange(day)}
        />
        {authUser.roles.includes(ROLES.TEACHER) ||
        authUser.roles.includes(ROLES.ADMIN) ? (
          <Div>
            <Link
              activeClass="active"
              className="test1"
              to="classrooms"
              spy={true}
              smooth={true}
              duration={500}
            >
              <ClassroomButton
                className="classRoom"
                name="classroom"
                value="showClassroomComponent"
                onClick={evt => this.onChangeDisplayClassroom(evt)}
              >
                Classrooms
              </ClassroomButton>
            </Link>
            <Link
              activeClass="active"
              to="groupRooms"
              spy={true}
              smooth={true}
              duration={500}
            >
              <GroupRoomButton
                className="classRoom"
                name="classroom"
                value="showGroupRoomComponent"
                onClick={evt => this.onChangeDisplayGroupRoom(evt)}
              >
                Group Rooms
              </GroupRoomButton>
            </Link>
            <hr />

            {/* ----  Mapping starts here ----*/}
            <Element name="groupRooms" className="element">
              {showGroupRoomComponent
                ? bookableRooms.map(room => (
                    <GroupRoomButton
                      name={room}
                      key={room}
                      onClick={this.onChange}
                    >
                      {room}
                    </GroupRoomButton>
                  ))
                : null}
            </Element>
            <Element name="classrooms" className="element">
              {showClassroomComponent
                ? bookableClassRooms.map(room => (
                    <ClassroomButton
                      name={room}
                      key={room}
                      onClick={this.onChange}
                    >
                      {room}
                    </ClassroomButton>
                  ))
                : null}
            </Element>
          </Div>
        ) : (
          <Div>
            {bookableRooms.map(room => (
              <GroupRoomButton name={room} key={room} onClick={this.onChange}>
                {room}
              </GroupRoomButton>
            ))}
          </Div>
        )}

        {this.state.showTimeComponent ? (
          <BookTime {...this.state} close={this.closeTime} />
        ) : null}
      </React.Fragment>
    );
  }
}

export const GroupRoomComponent = () => (
  <Div>
    {bookableRooms.map(room => (
      <GroupRoomButton name={room} key={room} onClick={this.onChange}>
        {room}
      </GroupRoomButton>
    ))}
  </Div>
);

const condition = authUser => authUser;

const BookRoomForm = compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(BookRoomBase);

export default BookRoom;
