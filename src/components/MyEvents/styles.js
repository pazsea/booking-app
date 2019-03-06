import styled from "styled-components";

export const H3 = styled.h3`
  color: wheat;
  text-align: center;
  font-family: "Montserrat";
  font-weight: 600;
  margin: 10%;
`;

export const TitleOfSection = styled.h1`
  font-family: "Montserrat", sans-serif;
  font-size: 2.5em;
  font-weight: 400;
  margin: 0.7em 0;
  text-align: center;
  color: wheat;
  @media screen and (min-width: 1024px) {
    font-size: 4em;
  }
`;

export const InviteDiv = styled.div`
  margin: 2% 10%;
  border: none;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  padding: 1.5em 1em;
  background: #4d4d4d;
  border-radius: 4px;
  text-align: center;
  color: wheat;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;
  font-family: "Montserrat";

  p {
    margin-bottom: 0;
    letter-spacing: 0;
    line-height: 1.8em;
    font-size: 1em;
  }
  ul {
    list-style: none;
    line-height: 2em;
    /* padding: 0.8em; */
  }
  ul li:nth-child(1) {
    font-size: 1em;
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
    margin: 1em 0;
    font-family: "Montserrat";
  }

  .fa-map-marked-alt {
    margin: auto 0.5em;
    color: black;
  }

  .fa-user-slash {
    margin: auto 0.5em;
    color: #c5766b;
  }

  .fa-question {
    color: white;
    margin: auto 0.5em;
    font-size: 0.9em;
  }

  .fa-user-check {
    color: #599272;
    margin: auto 0.5em;
  }

  * {
    margin: 0;
  }
  @media screen and (min-width: 1024px) {
    margin: 2% 15%;
    border: none;
    height: -webkit-fit-content;
    height: -moz-fit-content;
    height: fit-content;
    padding: 1.5em 1em;
    background: #4d4d4d;
    border-radius: 4px;
    text-align: center;
    color: wheat;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;
    text-shadow: 0.03125em 0.03125em 0.09355em #152029;

    .GroupRoom {
      font-size: 1.5em;
    }

    p {
      margin-bottom: 0;
      letter-spacing: 0;
      line-height: 1.8em;
      font-size: 1em;
    }
    ul {
      list-style: none;
      line-height: 2em;
      margin: 0.5em 0;
      font-size: 1.5em;
      padding: 0;
    }
    /* ul li:nth-child(1) {
      font-size: 1em;
    } */
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

    .fa-map-marked-alt {
      margin: auto 1em;
      color: black;
    }
    * {
      margin: 0;
    }
  }
`;

export const PositiveButton = styled.button`
  font-family: "Montserrat", sans-serif;
  padding: 10px;
  background-color: #97a7b9;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 1em;
  margin-right: 1%;
  font-weight: 600;
  cursor: pointer;
  :hover {
    background: #97a7b9a1;
  }

  @media screen and (min-width: 1024px) {
    font-size: 1.2em;
  }
`;

export const NegativeButton = styled.button`
  font-family: "Montserrat", sans-serif;
  padding: 10px;
  background-color: #d2b9bf;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 1em;
  margin-left: 1%;
  font-weight: 600;
  cursor: pointer;
  :hover {
    background: #d2b9bfb5;
  }

  @media screen and (min-width: 1024px) {
    font-size: 1.2em;
  }
`;
