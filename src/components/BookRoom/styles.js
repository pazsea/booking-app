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

  .roomButton {
    color: white;
    padding: 0.7em 1.7em;
    margin-top: 5%;
    border-radius: 0.4em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 1.5em;
    color: #ffffff;
    background-color: #6fbd75;
    box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
      inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
      inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
    position: relative;
    :active {
      box-shadow: inset 0 0.6em 2em -0.3em rgba(0, 0, 0, 0.15),
        inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
    }
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
