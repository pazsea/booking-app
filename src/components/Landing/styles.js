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
  p {
    width: 50%;
    height: fit-content;
    justify-content: space-around;
    display: flex;
    padding: 10px;
    @media screen and (max-width: 700px) {
      width: 80%;
    }
    
    }
`;
