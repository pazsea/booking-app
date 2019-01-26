import React from "react";
import { Div } from "./styles";

const Landing = () => (
  <Div style={{ backgroundImage: `url(${"./pics/note.jpg"})` }}>
    <p>
      <button>Sign In</button>
      <button>Register User</button>
    </p>
  </Div>
);

export default Landing;
