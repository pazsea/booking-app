import styled from "styled-components";

export const InviteDiv = styled.div`
  margin: 10%;
  border: 2px solid wheat;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  padding: 1.5em 1em;
  background: #535d69;
  border-radius: 8px;
  text-align: center;
  color: wheat;
  ul {
    list-style: none;
    line-height: 2em;
    padding: 0.8em;
  }
  input {
    width: 100%;
    height: 4em;
    overflow-y: auto;
    -webkit-align-items: top;
    -webkit-box-align: top;
    -ms-flex-align: top;
    align-items: top;
    text-align: left;
    text-decoration: none;
    border-style: none;
    border-radius: 8px;
    padding: 0.5em;
    margin-bottom: 1em;
  }

  /* button {
    width: 50%;
  } */

  * {
    margin: 0;
    font-family: "Montserrat", sans-serif;
  }
`;

export const MyEventsButton = styled.button`
  font-family: "Montserrat", sans-serif;

  padding: 10px;
  background-color: white;
  width: 50%;
  border-radius: 8px;
  border: 2px solid #ced8ec;
  color: black;
`;

export const MyEventsDeleteButton = styled.button`
  font-family: "Montserrat", sans-serif;

  padding: 10px;
  background-color: white;
  width: 50%;
  border-radius: 8px;
  border: 2px solid #ced8ec;
  color: black;
`;

export const AttendEventButton = styled.button`
  font-family: "Montserrat", sans-serif;
  padding: 10px;
  background-color: grey;
  width: 50%;
  border-radius: 8px;
  border: 2px solid #ced8ec;
  color: black;
  &.activeButton {
    background: green;
  }
`;
