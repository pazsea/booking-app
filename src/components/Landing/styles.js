import styled from "styled-components";
import img from "./pics/note.jpg";

export const Div = styled.div`
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  justify-content: center;
  height: 100vh;
  h1 {
    text-align: center;
    border: 2px solid #cfecef;
    background: rgba(30, 128, 121, 0.6);
    color: #cfecef;
    margin: 10% auto;
    width: 50%;
    height: fit-content;
    justify-content: space-around;
    display: flex;
    padding: 10px;
    @media screen and (max-width: 700px) {
      width: 80%;
      margin: 30% auto;
    }
  }
`;
