import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div } from "./styles";
import { AuthUserContext } from "../Session";
import DatePicker from "react-datepicker";

import BookTime from "../BookTime";

import "react-datepicker/dist/react-datepicker.css";

import { withFirebase } from "../Firebase";

const BookRoom = () => (
  <Div>
    <h1>Book A Room</h1>
    <AuthUserContext.Consumer>
      {authUser => <BookRoomForm authUser={authUser} />}
    </AuthUserContext.Consumer>
  </Div>
);

class BookRoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookDate: new Date().toLocaleDateString(),
      showComponent: false
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
  handleChange(date) {
    this.setState({
      bookDate: date
    });
  }

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

  render() {
    return (
      <React.Fragment>
        <DatePicker
          dateFormat="yyyy/MM/dd"
          selected={this.state.bookDate}
          onChange={this.handleChange}
        />
        <ul>
          <li>
            <button name="Group Room 1" onClick={this.onChange}>
              Grouproom 1
            </button>

            <button name="Group Room 2" onClick={this.onChange}>
              Grouproom 2
            </button>
            {this.state.showComponent ? (
              <BookTime {...this.state} close={this.closeTime} />
            ) : null}
          </li>
        </ul>
      </React.Fragment>
    );
  }
}

const BookRoomForm = compose(
  withRouter,
  withFirebase
)(BookRoomBase);

export default BookRoom;

/*       <form onSubmit={this.onSubmit}>
        <input
          name="groupRoom"
          value={groupRoom}
          onChange={this.onChange}
          type="text"
          placeholder="Group Rooms"
        />
        <input
          name="date"
          value={date}
          onChange={this.onChange}
          type="text"
          placeholder="Date"
        />
        <input
          name="time"
          value={time}
          onChange={this.onChange}
          type="text"
          placeholder="Time"
        />
        <button type="submit">Send to DB</button>
      </form> */
