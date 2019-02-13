import React, { Component } from "react";
import { Spinner } from "react-mdl";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const Invites = () => (
  <AuthUserContext.Consumer>
    {authUser => <InvitesComplete authuser={authUser} />}
  </AuthUserContext.Consumer>
);

class InvitesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem("authUser"));
    this.setState({
      uid: user.uid,
      username: user.username
    });
  }

  /*     this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("username")
      .once("value", snapshot => {
        const username = snapshot.val();
        this.setState(prevState => {
          return {
            username: prevState.username
          }
     
        })
      }); */

  render() {
    return (
      <div>
        <p>hello</p>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const InvitesComplete = withFirebase(InvitesBase);

export default compose(withAuthorization(condition))(Invites);
