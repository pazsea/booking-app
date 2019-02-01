import React, { Component } from "react";
import { compose } from "recompose";
import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";
const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <groupRooms />
  </div>
);
class groupRoomsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      groupRooms: []
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.groupRooms().on("value", snapshot => {
      const groupRoomObject = snapshot.val();
      if (groupRoomObject) {
        const groupRoomList = Object.keys(groupRoomObject).map(key => ({
          ...groupRoomObject[key],
          uid: key
        }));
        // convert groupRooms list from snapshot
        this.setState({ groupRooms: groupRoomList, loading: false });
      } else {
        this.setState({ groupRooms: null, loading: false });
      }
    });
  }
  componentWillUnmount() {
    this.props.firebase.groupRooms().off();
  }
  render() {
    const { groupRooms, loading } = this.state;
    return (
      <div>
        {loading && <div>Loading ...</div>}
        {groupRooms ? (
          <groupRoomList groupRooms={groupRooms} />
        ) : (
          <div>There are no groupRooms ...</div>
        )}
      </div>
    );
  }
}

const groupRoomList = ({ groupRooms }) => (
  <ul>
    {groupRooms.map(groupRoom => (
      <groupRoomItem key={groupRoom.uid} groupRoom={groupRoom} />
    ))}
  </ul>
);
const groupRoomItem = ({ groupRoom }) => (
  <li>
    <strong>{groupRoom.userId}</strong> {groupRoom.text}
  </li>
);

const groupRooms = withFirebase(groupRoomsBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
