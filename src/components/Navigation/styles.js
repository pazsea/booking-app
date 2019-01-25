import styled from "styled-components";

export const Nav = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 200px;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: beige;
  transition: width 0.5s;

  ul {
    padding: 0;
  }
  li {
    flex: 1;
    color: black;
    padding: 16px;
    text-decoration: none;
    border: 2px solid black;
    background-color: whitesmoke;
    margin: 5%;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 2px 1px black;
  }
  li:active {
    background-color: #4caf50;
    color: white;
  }
  li:hover {
    background-color: #555;
    color: white;
  }
  @media screen and (max-width: 700px) {
    width: 0;
  }
`;
