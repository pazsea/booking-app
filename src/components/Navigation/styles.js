import styled from "styled-components";

export const Nav = styled.nav`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  max-height: ${props => (props.stateNav ? "0px" : "500px")};
  overflow: auto;
  transition: max-height 0.5s ease-out;
  background: lightseagreen;
  justify-content: center;
  overflow-y: hidden;

  ul {
    min-width: 100%;
    width: fit-content;
    justify-content: center;
    padding: 5px;
    display: flex;
    list-style: none;

    @media screen and (max-width: 1024px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  li {
    margin: 5px 5px;
    background: #28d;
    border-color: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 10px;
    padding: 12px;
    text-transform: uppercase;
    height: fit-content;
    :active {
      background-color: #4caf50;
      color: white;
    }
    :hover {
      background: #17c;
    }
    :focus {
      border-color: #05a;
    }
    @media screen and (max-width: 1024px) {
      width: 40%;
      text-align: center;
    }
  }
`;
