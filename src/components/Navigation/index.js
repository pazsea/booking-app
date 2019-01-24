import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from "./styles";

import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
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
    </ul>
  </div>
);

export default Navigation;


/* export class Sidebar extends Component {
  render() {
    return (
      <Router>
        <Nav>
          <ul>
            <li>
              <Link to="/">Upcoming Events</Link>
            </li>
            <li>
              <Link to="/invites">Invites</Link>
            </li>
            <li>
              <Link to="/rooms">Book Room</Link>
            </li>

            <li>
              <Link to="/myevents">My Events</Link>
            </li>
            <li>
              <Link to="/statistic">Statistic</Link>
            </li>
          </ul>

        </Nav>
      </Router>
    );
  }
}

export default Sidebar; */