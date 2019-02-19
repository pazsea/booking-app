import styled from "styled-components";

export const Div = styled.div`
  margin: 10% 10%;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  h1 {
    color: white;
  }
  p {
    color: white;
  }

  input:first-child {
    font-size: 20px;
    width: 100%;
    padding: 10px;
    text-align: center;
    input:first-child:focus {
      box-shadow: 0 0 10px white;
      border: 5px solid white;
    }
  }
`;

export const GroupRoomButton = styled.button`
  color: white;
  padding: 0.7em 1.7em;
  margin-top: 5%;
  border: none;
  border-radius: 0.4em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 1.5em;
  background-color: #c72b2b;
  position: relative;
`;
