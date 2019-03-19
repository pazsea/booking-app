import styled from "styled-components";

export const Div = styled.div`
  width: 50%;
  margin: 10% auto;
  text-align: center;
  border: 1.5px solid #97a7b9;
  background: #121c24;
  border-radius: 4px;

  * {
    margin: 0;
    padding: 0.2em 0;
    box-sizing: border-box;
    text-decoration: none;
    color: wheat;
    font-family: "Montserrat";
  }
  h1 {
    color: #97a7b9;
  }
  p {
    color: #97a7b9;
    padding: 0 1em;
  }
  ul {
    background: #192530;
    margin: 0.5em 1em;
    border-radius: 4px;
    list-style: none;
  }
  li {
    color: #97a7b9;
    padding: 0.5em 0;
  }
  span {
    color: #97a7b9;
  }
  hr {
    margin-top: 1em;
    border: 0;
    height: 1px;
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0),
      #97a7b9,
      rgba(0, 0, 0, 0)
    );
    padding: 0;
  }

  hr:last-child {
    display: hide;
  }

  @media screen and (max-width: 700px) {
    margin-left: 10%;
    margin-right: 10%;
    width: 80%;
  }
`;
