import styled from "styled-components";
import img from "./pics/note.jpg";

export const Div = styled.div`
  background-image: url(${img});
  background-size: cover;
  background-repeat: no-repeat;
  overflow-y: hidden;
  display: flex;
  position: relative;
  justify-content: center;
  min-height: calc(100vh - 78px);
  h1 {
    text-align: center;
    border: 2px solid #424a54;
    background: rgba(66, 74, 84, 0.6);
    color: wheat;
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
