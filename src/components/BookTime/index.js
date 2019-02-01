import React, { Component } from "react";

class BookTime extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { close, bookDate, groupRoom } = this.props;
    return (
      <React.Fragment>
        <div>
          <button onClick={close}>Close</button>
          <p>{bookDate.toLocaleDateString()}</p>
          <p>{groupRoom}</p>
          <input type="checkbox" />
          <label>Check me</label>
        </div>

        <br />
        <button>Send to DB</button>
      </React.Fragment>
    );
  }
}

export default BookTime;
