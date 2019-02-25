import styled from "styled-components";

export const Nav = styled.nav`
  margin: 0;
  padding: 0;
  width: 100%;
  max-height: ${props =>
    props.stateNav ? "0px" : { height: "calc(100vh - 76px)" }};
  background-color: #121c24;
  overflow-y: hidden;
  z-index: 100;
  position: absolute;

  ul {
    width: fit-content;
    padding: 5px;
    list-style: none;

    @media screen and (max-width: 1024px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  li {
    margin: 5px 5px;
    background: #e9b522;
    border-color: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 10px;
    padding: 12px;
    text-transform: uppercase;
    height: fit-content;
    :active {
      background-color: #e9b52282;
      color: white;
    }
    :hover {
      background: #e9b52282;
    }
    :focus {
      border-color: #e9b52282;
    }
    @media screen and (max-width: 1024px) {
      width: 40%;
      text-align: center;
    }
  }
  ul li a {
    color: white;
  }
`;
