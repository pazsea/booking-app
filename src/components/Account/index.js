import React from "react";

import { AuthUserContext } from "../Session";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization } from "../Session";
import { Div } from "./styles";

/*
AccountPage component:

This only shows the signed in users email. The password change form is where the user can change password. 
Password management is handled by firebase. So no sensitive information can leak out.
*/

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Div>
        <h1>Account: {authUser.email}</h1>

        <PasswordChangeForm />
      </Div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
