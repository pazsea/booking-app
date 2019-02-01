import React, { Component } from "react";

import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const BookTime = props => (
  <div>
    <BookTimeComplete {...props} />
  </div>
);

class BookTimeBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookDate: this.props.bookDate,
      room: this.props.groupRoom
    };
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  sendToDB = (event, authUser) => {
    this.props.firebase.room().push({
      ...this.state,
      userId: authUser.uid
    });
    event.preventDefault();
  };

  render() {
    const { close, bookDate, groupRoom } = this.props;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <div>
              <button onClick={close}>Close</button>
              <p>{bookDate}</p>
              <p>{groupRoom}</p>
              <label>
                <input
                  type="checkbox"
                  name="07:00-08:00"
                  onChange={this.onChangeCheckbox}
                />
                07:00-08:00
              </label>
              <label>
                <input
                  type="checkbox"
                  name="08:00-09:00"
                  onChange={this.onChangeCheckbox}
                />
                08:00-09:00
              </label>
            </div>

            <br />

            <button onClick={event => this.sendToDB(event, authUser)}>
              Send to DB
            </button>
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

const BookTimeComplete = withFirebase(BookTimeBase);

export default compose(withAuthorization(condition))(BookTime);
