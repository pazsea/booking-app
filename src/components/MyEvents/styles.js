import styled from "styled-components";

export const InviteDiv = styled.div`
  padding: 0.2em;
  color: black;
  background: white;
  margin: 0 10%;

  height: fit-content;
  ul {
    display: flex;
    justify-content: center;
    list-style: none;
  }
  input {
    width: 100%;
    height: 4em;
    overflow-y: auto;
    align-items: top;
    text-align: left;
  }
  button {
    width: 50%;
  }

  * {
    margin: 0;
  }
`;
