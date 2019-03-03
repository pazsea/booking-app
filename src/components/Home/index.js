import React, { Component } from "react";

import { Div } from "./styles";
// import { AuthUserContext } from "../Session";
// import Map from "../Map";

class HomePage extends Component {
  render() {
    return (
      <Div>
        <h1>Home</h1>
      </Div>
    );
  }
}

export default HomePage;

// class HomePage extends Component {
//   render () {
//     return (
//       <AuthUserContext.Consumer>
//         { authUser => (
//           {/* <Map userId={authUser.uid} firebase={this.props.firebase} /> */ }
//         ) }
//       </AuthUserContext.Consumer>
//     );
//   }
// }
