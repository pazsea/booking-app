import styled from "styled-components";
import img from "./pics/note.jpg";

export const Div = styled.div`
  background-image: url(${ img });
  background-size:cover;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  border: 2px solid red;
  p {
    width: 50%;
    height: fit-content;
    border: 2px solid yellow;
    justify-content: space-around;
    display: flex;
    padding: 10px;
    button {
      background: #28d;
      border-color: transparent;
      color: #fff;
      cursor: pointer;
      padding: 12px;
      text-transform: uppercase;
      border-radius: 5px;
    }
    button:hover {
      background: #17c;
    }
    @media screen and (max-width: 700px) {
      width: 80%;
    }
  }
`;
