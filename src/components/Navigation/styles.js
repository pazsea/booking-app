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
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  li {
    color: #fff;
    cursor: pointer;
    text-transform: uppercase;
    height: fit-content;

    @media screen and (max-width: 1024px) {
      text-align: center;
    }
  }
  ul li a {
    color: white;
    text-decoration: none;
    display: block;
    border: #111921 1px solid;
    box-shadow: #192530 1px 1px 10px;
    padding: 15px;
    margin: 1px 5px;
    background: #e1c74e;
    transition: 0.3s;
    animation: fadein 0.3s;
    text-decoration: none;
    text-shadow: 1px 1px 1px #152029;
    font-family: "Montserrat", sans-serif;
    font-weight: 750;
    font-size: 2.5rem;
    color: #f1f1f1;
    &.active {
      text-decoration: #f1f1f1;
      background-color: #6c5f24;
    }
    :hover {
      text-decoration: #f1f1f1;
      background: #87772e;
    }
    :focus {
      border-color: #e9b52282;
    }
  }
`;

// a {
//   width: 40 %;
//   margin: 10px 10 %;
//   border: #111921 1px solid;
//   box - shadow: #192530 1px 1px 10px;
//   background - color: #1f2f3c;
//   transition: 0.3s;
//   animation: fadein 0.3s;
//   text - decoration: none;
// }

// a: hover {
//   background: #213d54;
//   border: 1px solid #192530;
// }

// h1 {
//   font - family: "Oswald", sans - serif;
//   font - weight: 300;
//   font - size: 2rem;
//   color: #f1f1f1;
// }

// h1: hover {
// }
