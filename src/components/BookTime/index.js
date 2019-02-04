import React, { Component } from "react";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const BookTime = props => (
  <div>
    <BookTimeComplete {...props} />
  </div>
);

const times = [
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00"
];

const returnFalseTimes = () =>
  Object.assign({}, ...times.map(item => ({ [item]: false })));

export const MyInput = ({ name, time, onChangeCheckbox }) => (
  <React.Fragment>
    <label>
      <input
        type="checkbox"
        name={name}
        onChange={() => onChangeCheckbox(name)}
        checked={time[{ name }]}
      />
      {name}
    </label>
    <br />
  </React.Fragment>
);

class BookTimeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDate: this.props.bookDate,
      time: returnFalseTimes()
    };
  }
  componentWillReceiveProps() {
    this.setState({
      time: returnFalseTimes()
    });
  }
  onChangeCheckbox = name => {
    this.setState(prevState => ({
      time: {
        ...prevState.time,
        [name]: !prevState.time[name]
      }
    }));
  };

  sendToDB = (event, authUser) => {
    this.props.firebase
      .rooms()
      .child(this.props.groupRoom)
      .push({
        date: this.props.bookDate,
        user: authUser.uid,
        time: { ...this.state.time }
      });
    event.preventDefault();
  };

  render() {
    const { close, bookDate, groupRoom } = this.props;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <div>
              <button onClick={close}>Close</button>
              <p>{bookDate}</p>
              <p>{groupRoom}</p>
              {times.map(time => (
                <MyInput
                  key={time}
                  name={time}
                  time={this.state.time}
                  onChangeCheckbox={this.onChangeCheckbox}
                />
              ))}
            </div>

            <br />

            <button onClick={event => this.sendToDB(event, authUser)}>
              Send to DB
            </button>
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

const BookTimeComplete = withFirebase(BookTimeBase);

export default compose(withAuthorization(condition))(BookTime);
