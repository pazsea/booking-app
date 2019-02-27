import React from "react";
import { Nav } from "../Navigation/styles";
import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <Nav onClick={firebase.doSignOut}>Sign Out</Nav>
);

export default withFirebase(SignOutButton);
