import React from "react";
import { SignOutBtn } from "./styles";
import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => (
  <SignOutBtn onClick={firebase.doSignOut}>
    Sign Out <i className="fas fa-sign-out-alt" />
  </SignOutBtn>
);

export default withFirebase(SignOutButton);
