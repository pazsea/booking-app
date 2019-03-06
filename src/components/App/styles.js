import styled from "styled-components";

export const Menu = styled.div`
  width: 100%;
  height: 76px;
  background-color: #121c24;
  z-index: 100;
  border-bottom: 1px solid #192530;
`;

export const MenuItems = styled.div`
  position: relative;
  height: 76px;
  margin: auto 0;
  display: flex;
  padding-left: 10px;
  border-bottom: 2px solid #192530;
  transition: 0.2s;
  animation: fadein 0.3s;

  i {
    color: #f1f1f1;
    z-index: 2;
    margin: auto 0.1em;
    &.active {
      color: wheat;
    }

    :hover {
      color: wheat;
      cursor: pointer;
    }
  }

  h1 {
    font-family: "Montserrat";
    font-size: 2.7em;
    margin: auto 0;
    padding-left: 0.5em;
    color: #97a7b9;
    text-shadow: 0.03125em 0.03125em 0.15625em #111921;
    border-bottom: none;
    font-weight: 900;
  }

  @media screen and (min-width: 1024px) {
    border-bottom: 1px solid #c3d0d9;

    h1 {
      font-size: 3.5em;
      padding-left: 0.5em;
      letter-spacing: 0.05em;
      font-weight: 400;
    }
  }
`;
