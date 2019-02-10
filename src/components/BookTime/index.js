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

class BookTimeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDate: this.props.bookDate,
      time: returnFalseTimes(),
      reservedTime: returnFalseTimes(),
      loading: false,
      username: [],
      isInvited: {},
      desc: ""
    };
  }

  componentDidMount(authUser) {
    this.setState({ loading: true });
    this.props.firebase.users().on("value", snapshot => {
      const userObj = Object.values(snapshot.val());
      const map1 = userObj.map(function(userO) {
        return userO.username;
      });
      this.setState({ mapeusernames: map1 });
    });

    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .child("time")
      .on("value", snapshot => {
        const bookedObject = snapshot.val();
        if (bookedObject) {
          const bookedList = bookedObject;
          // convert booked list from snapshot
          this.setState({ time: bookedList, loading: false });
          this.setState({ reservedTime: {} });
        } else {
          this.setState({ time: {}, loading: false });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.groupRoom !== prevProps.groupRoom ||
      this.props.bookDate !== prevProps.bookDate
    ) {
      this.setState({ loading: true });
      this.props.firebase
        .bookedEventDateTimes()
        .child(this.props.groupRoom)
        .child(this.props.bookDate)
        .child("time")
        .on("value", snapshot => {
          const bookedObject = snapshot.val();
          if (bookedObject) {
            const bookedList = bookedObject;
            // convert booked list from snapshot
            this.setState({ time: bookedList, loading: false });
            this.setState({ reservedTime: {} });
          } else {
            this.setState({ time: {}, loading: false });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .off();
    this.props.firebase.users().off();
  }

  componentWillReceiveProps() {
    this.setState({ loading: true });
    this.props.firebase
      .bookedEventDateTimes()
      .child(this.props.groupRoom)
      .child(this.props.bookDate)
      .child("time")
      .on("value", snapshot => {
        const bookedObject = snapshot.val();
        if (bookedObject) {
          const bookedList = bookedObject;
          // convert booked list from snapshot
          this.setState({ time: bookedList, loading: false });
        } else {
          this.setState({ time: returnFalseTimes(), loading: false });
        }
      });
  }
  onChangeCheckbox = name => {
    this.setState(prevState => ({
      reservedTime: {
        ...prevState.reservedTime,
        [name]: !prevState.reservedTime[name]
      }
    }));
  };

  getValueInput(evt) {
    const inputValue = evt.target.value;
    this.setState({ input: inputValue });
    this.filterNames(inputValue);
  }

  writeDesc(event) {
    const inputValue = event.target.value;
    this.setState({ desc: inputValue });
  }

  filterNames(inputValue) {
    const { mapeusernames } = this.state;
    if (inputValue.length === 0) {
      this.setState({ username: [] });
    } else {
      this.setState({
        username: mapeusernames.filter(usernames =>
          usernames.includes(inputValue)
        )
      });
    }
  }

  pushToInvited = user => {
    var { isInvited } = this.state;
    const invitees = Object.keys(isInvited);
    if (invitees.length === 0 || !invitees.includes(user)) {
      isInvited[user] = true;
      this.setState({ isInvited });
    } else {
      console.log("User already booked");
    }
  };

  deleteInvited = key => {
    const { isInvited } = this.state;
    delete isInvited[key];
    this.setState({ isInvited });
  };

  sendToDB = (event, authUser) => {
    if (Object.keys(this.state.reservedTime).length) {
      const newObj = Object.assign(
        {},
        { ...this.state.time },
        { ...this.state.reservedTime }
      );
      this.props.firebase
        .bookedEventDateTimes()
        .child(this.props.groupRoom)
        .child(this.props.bookDate)
        .set({ time: { ...newObj } });
      event.preventDefault();

      this.props.firebase
        .events()
        .child(this.props.groupRoom)
        .push({
          date: this.props.bookDate,
          host: authUser.uid,
          time: { ...newObj },
          isInvited: { ...this.state.isInvited },
          description: this.state.desc
        });
      this.setState({ isInvited: {}, desc: "", username: [] });
      event.preventDefault();
    } else {
      alert("You haven't booked any time slots for you event");
      event.preventDefault();
    }
  };

  render() {
    const { close, bookDate, groupRoom } = this.props;
    const { loading, username } = this.state;
    const isInvitedKeys = Object.keys(this.state.isInvited);
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {loading ? (
              <div>Loading ...</div>
            ) : (
              <form>
                <button onClick={close}>Close</button>
                <p>{bookDate}</p>
                <p>{groupRoom}</p>
                {times
                  .filter(time => !this.state.time[time])
                  .map(time => (
                    <MyInput
                      key={time}
                      name={time}
                      time={this.state.time}
                      onChangeCheckbox={this.onChangeCheckbox}
                    />
                  ))}

                <label>
                  Invite?
                  <br />
                  <input
                    type="text"
                    name="name"
                    placeholder="Search for users."
                    onChange={evt => this.getValueInput(evt)}
                  />
                </label>
                <ul>
                  {isInvitedKeys.map(key => (
                    <li
                      name={key}
                      key={key}
                      onClick={() => this.deleteInvited(key)}
                    >
                      {key}
                    </li>
                  ))}
                </ul>

                <ul>
                  {username
                    .filter(user => user.length > 0)
                    .map(user => (
                      <li
                        name={user}
                        key={user}
                        onClick={() => this.pushToInvited(user)}
                      >
                        {user}
                      </li>
                    ))}
                </ul>

                <br />
                <input
                  type="text"
                  name="description"
                  value={this.state.desc}
                  onChange={event => this.writeDesc(event)}
                />

                <br />
                <input
                  type="submit"
                  value="Submit"
                  onClick={event => this.sendToDB(event, authUser)}
                />
              </form>
            )}
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

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

const condition = authUser => !!authUser;

const BookTimeComplete = withFirebase(BookTimeBase);

export default compose(withAuthorization(condition))(BookTime);
