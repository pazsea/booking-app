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
        </div>
        <button>07:00 - 08:00</button>
        <button>07:00 - 08:00</button>
        <br />
        <button>Send to DB</button>
      </React.Fragment>
    );
  }
}

export default BookTime;
