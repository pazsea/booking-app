import styled from "styled-components";

export const SignOutBtn = styled.a`
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
  cursor: pointer;
  &.active {
    background-color: #bb971e;
  }
  :hover {
    background: #d1a200;
  }
  :focus {
    border-color: #e9b52282;
  }

  .fa-sign-out-alt {
    color: wheat;
  }
  @media screen and (min-width: 1024px) {
    display: block;
    border: #c3d0d9 1px solid;
    border-radius: 0.19375em;
    box-shadow: 0.0625em 0.0625em 0.09375em #152029;
    padding: 0.5em;
    margin: 0.01em 0;
    background: #192530;
    transition: 0.3s;
    animation: fadein 0.3s;
    text-shadow: 0.03125em 0.03125em 0.09355em #152029;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    color: wheat;
    cursor: pointer;
    font-size: 1em;
    &.active {
      background-color: #bb971e;
    }
    :hover {
      background: #d1a200;
    }
    :focus {
      border-color: #e9b52282;
    }
    i {
      font-size: 1em;
      color: wheat;
      margin-left: 0.5em;
    }
  }
`;
