import React, { Component } from "react";

import { compose } from "recompose";

import { AuthUserContext, withAuthorization } from "../Session";

class HomePage extends Component {
  render() {
    return <h1>Home</h1>;
  }
}

const condition = authUser => !!authUser;
export default compose(withAuthorization(condition))(HomePage);
