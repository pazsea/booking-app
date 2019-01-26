import styled from "styled-components";

export const Div = styled.div`
  /*   margin-left: 30%;
  margin-right: 10%;
  margin-top: 8%;
  display: flex;
  background: grey;
  width: 50%;
  height: 50vh;
  justify-content: space-around;
  align-items: center;
  flex-direction: column; */

  width: 500px;
  margin-left: 30%;
  margin-right: 10%;
  margin-top: 8%;
  font-size: 16px;

  button {
    background: white;
    border-radius: 3px;
  }

  h1 {
    background: #28d;
    padding: 20px;
    font-size: 1.4em;
    font-weight: normal;
    text-align: center;
    text-transform: uppercase;
    color: #fff;
  }

  form {
    background: #ebebeb;
    padding: 12px;
  }

  input[type="text"],
  input[type="password"] {
    background: #fff;
    border-color: #bbb;
    color: #555;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    border-color: #888;
  }

  button[type="submit"] {
    background: #28d;
    border-color: transparent;
    color: #fff;
    cursor: pointer;
    padding: 12px;
    text-transform: uppercase;
    width:100%;
  }

  button[type="submit"]:hover {
    background: #17c;
  }

  /* Buttons' focus effect */
  button[type="submit"]:focus {
    border-color: #05a;
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
