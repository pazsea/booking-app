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
`;
