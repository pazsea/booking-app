import React, { Component } from "react";

import { compose } from "recompose";

import { AuthUserContext, withAuthorization } from "../Session";
import Map from "../Map";

class HomePage extends Component {
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Map userId={authUser.uid} firebase={this.props.firebase} />
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(withAuthorization(condition))(HomePage);
