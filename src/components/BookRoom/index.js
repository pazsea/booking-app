import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div } from "./styles";
import { AuthUserContext } from "../Session";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const BookRoom = () => (
  <Div>
    <h1>SignUp</h1>
    <AuthUserContext.Consumer>
      {authUser => <BookRoomForm authUser={authUser} />}
    </AuthUserContext.Consumer>
  </Div>
);

const INITIAL_STATE = {
  groupRoom: "",
  date: "",
  time: ""
};

class BookRoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { groupRoom, date, time } = this.state;
    console.log(this.props.authUser.uid);
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
    debugger;
    event.preventDefault();
  };

  onChange = event => {
    console.log({ ...this.state });
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { groupRoom, date, time } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
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
      </form>
    );
  }
}

const BookRoomForm = compose(
  withRouter,
  withFirebase
)(BookRoomBase);

export default BookRoom;
