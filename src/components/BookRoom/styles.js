import styled from "styled-components";

export const Div = styled.div`
  margin: 10% 10%;
  border: 2px solid red;
  display: flex;
  flex-direction: column;
  text-align: center;

  .roomButton {
    padding: 0.7em 1.7em;
    border-radius: 0.2em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 1.5em;
    color: #ffffff;
    background-color: #3369ff;
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
  }
`;
