import React from 'react';

import { withFirebase } from '../Firebase';
import SignInPage from '../SignIn';

const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);