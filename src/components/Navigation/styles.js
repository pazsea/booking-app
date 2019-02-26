import styled from "styled-components";

export const Nav = styled.nav`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  max-height: ${props => (props.stateNav ? "0px" : "500px")};
  overflow: auto;
  transition: max-height 0.5s ease-out;
  justify-content: center;
  overflow-y: hidden;
  color: white;

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
    background: #8dd7d7;
    border-color: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 10px;
    padding: 12px;
    text-transform: uppercase;
    height: fit-content;
    .active {
      background-color: #8e8147;
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
    text-decoration: none;
    display: block;
  }
`;
