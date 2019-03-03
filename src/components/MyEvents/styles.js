import styled from "styled-components";

export const H3 = styled.h3`
  color: wheat;
  text-align: center;
  font-family: "Montserrat";
  font-weight: 600;
  margin: 10%;
`;

export const InviteDiv = styled.div`
  margin: 10%;
  border: none;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  padding: 1.5em 1em;
  background: #535d69;
  border-radius: 4px;
  text-align: center;
  color: wheat;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;
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
  background-color: #86a3b1;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 1.2em;
  margin-right: 1%;
  font-weight: 600;
`;

export const MyEventsDeleteButton = styled.button`
  font-family: "Montserrat", sans-serif;

  padding: 10px;
  background-color: #d2b9bf;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 1.2em;
  margin-left: 1%;
  font-weight: 600;
`;
