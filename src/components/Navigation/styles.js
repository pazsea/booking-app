import styled from "styled-components";

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
    border: #111921 1px solid;
    border-radius: 0.09375em;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;

    padding: 15px 10px;
    margin: 1px 5px;
    background: #edc903;
    transition: 0.3s;
    animation: fadein 0.3s;
    text-shadow: 0.03125em 0.03125em 0.09355em #152029;
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 2rem;
    color: #f1f1f1;
    &.active {
      background-color: #d1a200;
    }
    :hover {
      background: #d1a200;
    }
    :focus {
      border-color: #e9b52282;
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
    color: #f1f1f1;
  }
`;
