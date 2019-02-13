import styled, { keyframes } from "styled-components";
import { tada } from "react-animations";

export const Form = styled.form`
  margin-top: 5%;
  h2 {
    color: white;
    font-size: 3em;
    p {
      font-size: 0.5em;
      color: red;
    }
  }
  h4 {
    color: white;
  }
  #searchUser {
    width: 100%;
    font-size: 1.2em;
    margin: 5% 0;
  }

  #descriptionInput {
    width: 100%;
    height: 150px;
    overflow-y: auto;
  }
`;

export const StyledLabel = styled.label`
  display: inline-block;
  width: 10em;
  padding: 0.5em;
  font-size: 1.2em;
  margin: 3%;
  flex-direction: column-reverse;
  color: white;
  border: solid white 2px;
  background: #db7f5c;
  box-shadow: inset 0 -0.6em 1em -0.35em rgba(0, 0, 0, 0.17),
    inset 0 0.6em 2em -0.3em rgba(255, 255, 255, 0.15),
    inset 0 0 0em 0.05em rgba(255, 255, 255, 0.12);
  border-radius: 5px;

  input[type="checkbox"] label:before {
    color: white;
  }
  input[type="checkbox"]:checked + label:after {
    color: blue;
  }
  /* :hover,
  :focus {
    border-color: springgreen;
    color: springgreen;
  } */
`;

export const CustomButton2 = styled.button`
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #28a745;
`;

export const LoadingDiv = styled.div`
  font-size: 1.2em;
  color: white;
`;

export const CustomButton = styled.button`
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #dc3545;
`;

const tadaAnimation = keyframes`${tada}`;

export const AnimationDivConfirmed = styled.div`
  animation: 1s ${tadaAnimation};
`;

export const CorrectionDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
