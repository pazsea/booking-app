import styled from "styled-components";

export const Div = styled.div`
  width: 50%;
  margin: 10% auto;

  border: 1.5px solid #97a7b9;
  background: #121c24;
  border-radius: 4px;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    color: #97a7b9;
    font-family: "Montserrat";
    text-align: center;
  }

  h1 {
    letter-spacing: 0.1em;
  }

  button {
    background: white;
    border-radius: 3px;
    margin: 1em 0 0 0;
  }

  input[type="submit"]:disabled {
    background: red;
  }

  form {
    background: #121c24;
    padding: 1em;
  }

  input[type="text"],
  input[type="password"] {
    background: #fff;
    border-color: #bbb;
    color: #555;
    border-radius: 3px;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-color: #888;
  }

  button[type="submit"] {
    width: 100%;
    color: black;
    padding: 0.7em;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    text-decoration: none;

    font-weight: 600;
    text-transform: uppercase;
    font-size: 1.5em;
    background-color: #909fb1;
    position: relative;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background: #909fb182;
  }

  /* Buttons' focus effect */
  button[type="submit"]:focus {
    background: #909fb182;
  }

  input {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    padding: 16px;
    outline: 0;
    font-family: inherit;
    font-size: 0.95em;
  }
  @media screen and (max-width: 700px) {
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
  }
`;
