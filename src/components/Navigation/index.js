import React from "react";
import { Link } from "react-router-dom";

import { Nav, SpanArrow } from "./styles";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";

import { AuthUserContext } from "../Session";



const Navigation = (props) => (
  <Nav stateNav={props.stateNav}>
    {/* stateNav={props.stateNav} */}
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth />
        ) : (
          <NavigationNonAuth navToggle={props.navToggle} />
        )
      }
    </AuthUserContext.Consumer>
  </Nav>
);

const NavigationAuth = () => (
  <React.Fragment>
    <SpanArrow>
      <i className="fas fa-arrow-circle-down fa-4x" />
    </SpanArrow>

    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>
  </React.Fragment>
);

const NavigationNonAuth = (props) => (
  <React.Fragment>
    <SpanArrow>
      <i className="fas fa-arrow-circle-down fa-4x" onClick={props.navToggle} />
    </SpanArrow>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </React.Fragment>
);

export default Navigation;
