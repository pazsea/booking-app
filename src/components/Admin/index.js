import React, { Component } from "react";

import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { Div } from "./styles";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: []
    };
  }

  /*
  componendDidMount():

  When this lifecycle triggers it takes in all registered users. This page is only seen by users that have an ADMIN role.
  */

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));

      this.setState({
        users: usersList,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <Div>
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in admin user.</p>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
      </Div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID: </strong> {user.uid}{" "}
        </span>
        <br />
        <span>
          <strong>E-Mail: </strong> {user.email}{" "}
        </span>
        <br />
        <span>
          <strong>Username: </strong> {user.username}{" "}
        </span>
        <br />
        <hr />
      </li>
    ))}
  </ul>
);

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);
export default compose(
  withAuthorization(condition),
  withFirebase
)(AdminPage);
