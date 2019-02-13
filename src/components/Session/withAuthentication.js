/* import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: JSON.parse(localStorage.getItem("authUser"))
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem("authUser");
          this.setState({ authUser: null });
        }
      );
      this.username = this.props.firebase.onAuthUserListener(authUser => {
        this.props.firebase
          .users()
          .child(authUser.uid)
          .child("username")
          .once("value", snapshot => {
            const signedUsername = snapshot.val();
            this.setState({
              username: signedUsername
            });
          });
      });
    }

    componentWillUnmount() {
      this.listener();
      this.username();
    }

    render() {
      return (
        <AuthUserContext.Provider
          value={this.state.authUser}
          username={this.state.username}
        >
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication; */

import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: JSON.parse(localStorage.getItem("authUser"))
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          localStorage.setItem("authUser", JSON.stringify(authUser));
          this.setState({ authUser });
        },
        () => {
          localStorage.removeItem("authUser");
          this.setState({ authUser: null });
        }
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
