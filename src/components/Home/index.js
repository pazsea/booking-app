import React, { Component } from "react";

import { AuthUserContext } from "../Session";
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

export default HomePage;
