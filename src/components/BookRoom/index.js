import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { Div } from "./styles";
import { AuthUserContext } from "../Session";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

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

class BookRoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  handleChange(day) {
    this.setState({
      bookDate: day.toLocaleDateString()
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
        <p>Please type a day:</p>
        <DayPickerInput onDayChange={day => this.handleChange(day)} />
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
