import React, { Component } from "react";
// import { Spinner } from "react-mdl";
import { withFirebase } from "../Firebase";

const TimeSlots = props => <TimeSlotsComplete />;

class TimeSlotBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      choosenTimeSlots: {}
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  handleChange = evt => {
    const choosenTime = evt.value.value;
    // this.setState({
    //   choosenTimeSlots: [...this.state.choosenTimeSlots],
    //   choosenTime
    // });
    console.log(choosenTime);
  };

  render() {
    return (
      <button value={25200000} onClick={evt => this.handleChange(evt)}>
        TEEEEEST
      </button>
    );
  }
}

const TimeSlotsComplete = withFirebase(TimeSlotBase);

export default TimeSlots;
