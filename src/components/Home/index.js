import React, { Component } from "react";
import { Div } from "./styles";
import { compose } from "recompose";
import { withAuthorization } from "../Session";

class HomePage extends Component {
  render() {
    return (
      <Div>
        <h1>Home</h1>
      </Div>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(withAuthorization(condition))(HomePage);
