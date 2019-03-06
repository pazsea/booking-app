import styled from "styled-components";

export const H3 = styled.h3`
  color: wheat;
  text-align: center;
  font-family: "Montserrat";
  font-weight: 600;
  margin: 10%;
`;

export const InfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0.5em;
  /* ul {
    padding: 0 !important;
  } */

  @media screen and (min-width: 1024px) {
    padding: 0 4.5em;
    font-size: 1.5em;
  }
`;

export const InfoDiv2 = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0.5em;

  @media screen and (min-width: 1024px) {
    padding: 0 4.5em;
    font-size: 1.5em;
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
    font-size: 1em;
    padding: 0;
    margin: 0.5em 0;
  }
  li:nth-child(1) {
    margin: 0.5em 0;
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

  .fa-question {
    color: white;
    margin: auto 1em;
  }
  .fa-check {
    color: #599272;
    margin: auto 1em;
  }
  .fa-times {
    color: #c5766b;
    margin: auto 1em;
    font-size: 1.3em;
  }
  h3 {
    color: wheat;
  }
  h1 {
    color: wheat;
    font-size: 1em;
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

    p {
      margin-bottom: 0;
      letter-spacing: 0;
      line-height: 1.8em;
      font-size: 1em;
    }

    ul {
      list-style: none;
      font-size: 1.5em;
      padding: 0;
      margin: 0.5em 0;
    }
    li:nth-child(1) {
      margin: 0.5em 0;
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

    .fa-question {
      color: white;
    }
    .fa-check {
      color: #599272;
    }
    .fa-times {
      color: #c5766b;
    }
    h3 {
      color: wheat;
    }
    h1 {
      color: wheat;
      font-size: 1.5em;
    }
  }
`;

export const HelpButton = styled.button`
  font-family: "Montserrat", sans-serif;

  padding: 0.7em;
  background-color: #86a3b1;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 0.8em;
  margin-right: 1%;
  font-weight: 600;
  :hover {
    background: #86a3b180;
  }
  @media screen and (min-width: 1024px) {
    font-size: 1em;
  }
`;

export const NoHelpButton = styled.button`
  font-family: "Montserrat", sans-serif;

  padding: 0.7em;
  background-color: #d2b9bf;
  width: 48%;
  border-radius: 20px;
  border: none;
  color: black;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  font-size: 0.8em;
  margin-left: 1%;
  font-weight: 600;

  :hover {
    background: #d2b9bfb5;
  }
  @media screen and (min-width: 1024px) {
    font-size: 1em;
  }
`;

// export const AttendEventButton = styled.button`
//   font-family: "Montserrat", sans-serif;
//   padding: 10px;
//   background-color: grey;
//   width: 50%;
//   border-radius: 8px;
//   border: 2px solid #ced8ec;
//   color: black;
//   &.activeButton {
//     background: green;
//   }
// `;
