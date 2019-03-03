import React from "react";

import { AuthUserContext } from "../Session";
import PasswordChangeForm from "../PasswordChange";
import { withAuthorization } from "../Session";
import { Div } from "./styles";

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
