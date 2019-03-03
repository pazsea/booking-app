import styled from "styled-components";

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

  p {
    margin-bottom: 0;
    letter-spacing: 0;
    line-height: 1.8em;
    font-size: 1.2em;
  }
  ul {
    list-style: none;
    font-size: 1.2em;
    padding: 0.5em;
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

  li {
    display: flex;
    justify-content: space-evenly;
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
`;
