import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { Nav } from "./styles";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { AuthUserContext } from "../Session";
import * as ROLES from "../../constants/roles";

const Navigation = props => (
  <Nav stateNav={ props.stateNav }>
    <AuthUserContext.Consumer>
      { authUser =>
        authUser ? (
          <NavigationAuthComplete authUser={ authUser } />
        ) : (
            <NavigationNonAuth navToggle={ props.navToggle } />
          )
      }
    </AuthUserContext.Consumer>
  </Nav>
);

class NavigationAuthBase extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      totalInvites: 0
    };
  }

  componentDidMount () {
    this.props.firebase
      .user( this.props.authUser.uid )
      .child( "invitedToEvents" )
      .on( "value", snapshot => {
        if ( snapshot.val() !== null ) {
          const total = Object.keys( snapshot.val() ).length;
          this.setState( {
            totalInvites: total
          } );
        } else {
          this.setState( {
            totalInvites: 0
          } );
        }
      } );
  }

  componentWillUnmount () {
    this.props.firebase
      .user( this.props.authUser.uid )
      .child( "invitedToEvents" )
      .off();
  }

  render () {
    return (
      <React.Fragment>
        <ul className="main-nav">
          <li>
            <NavLink to={ ROUTES.HOME }>Home</NavLink>
          </li>
          <li>
            <NavLink to={ ROUTES.UPCOMING_EVENTS }>Upcoming Events</NavLink>
          </li>
          <li>
            <NavLink to={ ROUTES.INVITES }>Invites { this.state.totalInvites }</NavLink>
          </li>
          <li>
            <NavLink to={ ROUTES.MY_EVENTS }>My Events</NavLink>
          </li>
          <li>
            <NavLink to={ ROUTES.BOOK_ROOM }>Book a room</NavLink>
          </li>
          <li>
            <NavLink to={ ROUTES.ACCOUNT }>Account</NavLink>
          </li>
          { this.props.authUser.roles.includes( ROLES.ADMIN ) && (
            <li>
              <NavLink to={ ROUTES.ADMIN }>Admin</NavLink>
            </li>
          ) }
          <li>
            <SignOutButton />
          </li>
        </ul>
      </React.Fragment>
    );
  }
}

const NavigationNonAuth = props => (
  <React.Fragment>
    <ul className="main-nav">
      <li>
        <NavLink exact to={ ROUTES.LANDING }>Landing</NavLink>
      </li>
      <li>
        <NavLink to={ ROUTES.SIGN_IN }>Sign In</NavLink>
      </li>
    </ul>
  </React.Fragment>
);

const NavigationAuthComplete = withFirebase( NavigationAuthBase );

export default Navigation;
