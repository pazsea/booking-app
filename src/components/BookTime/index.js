import React, { Component } from "react";

class BookTime extends Component {
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

  render() {
    const { close, bookDate, groupRoom } = this.props;
    return (
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
        <button>Send to DB</button>
      </React.Fragment>
    );
  }
}

export default BookTime;
