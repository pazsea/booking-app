import styled from "styled-components";

export const Div = styled.div`
  margin: 10px 10%;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  h1 {
    color: #535d69;
  }
  p {
    color: #535d69;
  }

  li {
    width: 100%;
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
  width: 100%;
  color: wheat;
  padding: 0.7em 1.7em;
  margin-top: 5%;
  border: 1px solid wheat;
  border-radius: 0.4em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 1.3em;
  background-color: #535d69;
  position: relative;
  :focus {
    outline: 0;
  }
`;
export const ClassroomButton = styled.button`
  width: 100%;
  color: black;
  padding: 0.7em 1.7em;
  margin-top: 5%;
  border: 1px solid black;
  border-radius: 0.4em;
  box-sizing: border-box;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  text-transform: uppercase;
  font-size: 1.3em;
  background-color: #d2b9bf;
  position: relative;
  :focus {
    outline: 0;
  }
`;
