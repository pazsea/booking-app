import styled from "styled-components";

//background: #edc903;

export const Nav = styled.nav`
  margin: 0;
  padding: 0;
  width: 100%;
  max-height: ${props => (props.stateNav ? "0px" : "500px")};
  background-color: #192530;
  overflow: auto;
  transition: max-height 0.5s ease-out;
  justify-content: center;
  overflow-y: hidden;
  color: white;
  border-bottom: 1px solid #192530;

  ul {
    width: fit-content;
    list-style: none;

    @media screen and (max-width: 1024px) {
      width: auto;
      flex-direction: column;
      text-decoration: none;
      justify-content: center;
      align-items: center;
    }
  }
  li {
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;

    @media screen and (max-width: 1024px) {
      text-align: center;
    }
  }

  ul li a {
    display: block;
    border: #c3d0d9 1px solid;
    border-radius: 0.19375em;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;
    padding: 15px 10px;
    margin: 1px 5px;
    background: #192530;
    transition: 0.3s;
    animation: fadein 0.3s;
    text-shadow: 0.03125em 0.03125em 0.09355em #152029;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 2rem;
    color: wheat;
    &.active {
      background-color: #bb971e;
    }
    :hover {
      background: #d1a200;
    }
    :focus {
      border-color: #424a54;
    }
  }
`;

export const InvCounter = styled.span`
  text-shadow: 0.03125em 0.0625em 0.0625em #152029;
  font-family: "lobster", cursive;
  font-weight: 250;
  font-size: 1.8rem;
  padding-left: 5px;
  color: #f1f1f1;
  i {
    margin: 0 5px;
    color: wheat;
  }
`;
