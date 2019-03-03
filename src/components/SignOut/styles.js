import styled from "styled-components";

export const SignOutBtn = styled.button`
  display: block;
  border: #111921 1px solid;
  border-radius: 0.09375em;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  padding: 4px;
  margin: 8px auto;
  background: #bc0e00;
  transition: 0.3s;
  animation: fadein 0.3s;
  text-shadow: 0.03125em 0.03125em 0.03125em #152029;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 1.5rem;
  color: #f1f1f1;
  cursor: pointer;
  &.active {
    background-color: #920b00;
  }
  :hover {
    background: #920b00;
  }
`;
