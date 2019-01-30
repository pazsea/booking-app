import React from "react";


import { withAuthorization } from "../Session";
import { Div } from "./styles";

const HomePage = () => (
  <Div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
  </Div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
