import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import Select from "react-select";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
/* import * as ROLES from "../../constants/roles"; */
import { Div } from "./styles";

//TO DO

const SignUpPage = () => (
  <Div>
    <h1>SignUp</h1>
    <SignUpForm />
  </Div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null,
  selectedClassOption: null,
  selectedRoleOption: null,
  roles: null,
  classes: null
};

const roleOptions = [
  { value: "none", label: "None" },
  { value: "ADMIN", label: "ADMIN" },
  { value: "STUDENT", label: "STUDENT" },
  { value: "TEACHER", label: "TEACHER" }
];

const classOptions = [
  { value: "none", label: "None" },
  { value: "FE18", label: "FE18" },
  { value: "FE17", label: "FE17" }
];

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  handleChangeRole = selectedRoleOption => {
    this.setState({ selectedRoleOption });
    const selectRole = Object.values(selectedRoleOption).slice(1);
    this.setState({
      roles: selectRole
    });
  };

  handleChangeClass = selectedClassOption => {
    this.setState({ selectedClassOption });
    const selectClass = Object.values(selectedClassOption).slice(1);
    this.setState({
      classes: selectClass
    });
  };

  onSubmit = event => {
    const { username, email, passwordOne, classes, roles } = this.state;

    const usernameUpper = username.toUpperCase();
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        this.props.firebase
          .user(authUser.user.uid)
          .set({
            username: usernameUpper,
            email,
            hostedEvents: {},
            class: classes,
            roles
          })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };
  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    const { selectedRoleOption, selectedClassOption } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />

        <Select
          value={selectedRoleOption}
          onChange={this.handleChangeRole}
          options={roleOptions}
          placeholder="Select Role..."
        />

        <Select
          value={selectedClassOption}
          onChange={this.handleChangeClass}
          options={classOptions}
          placeholder="Select Class..."
        />

        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <form>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </form>
);
const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUpPage;
export { SignUpForm, SignUpLink };
