import styled from "styled-components";

export const Div = styled.div`
  margin: 10px 10%;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  h1 {
    color: #f1f1f1;
  }
  p {
    color: #f1f1f1;
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
  background-color: #fdc8c8;
  position: relative;
  :focus {
    outline: 0;
  }
`;
export const ClassroomButton = styled.button`
  width: 100%;
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
  background-color: #fdc8c8;
  position: relative;
  :focus {
    outline: 0;
  }
`;
