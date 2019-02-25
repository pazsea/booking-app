import styled, { keyframes } from "styled-components";
import { tada } from "react-animations";

export const Form = styled.form`
  * {
    font-family: "Montserrat", sans-serif;
  }
  margin-top: 5%;

  h2 {
    color: black;
    font-size: 3em;
    p {
      font-size: 0.5em;
      color: goldenrod;
    }
  }
  h4 {
    color: black;
  }
  #searchUser {
    width: 100%;
    font-size: 1.2em;
    margin: 5% 0;
    padding: 0.5em;
    border-radius: 8px;
  }

  #descriptionInput {
    width: 100%;
    height: 150px;
    overflow-y: auto;
    padding: 1em;
    border-radius: 8px;
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
  border-radius: 5px;

  input:first-child {
    display: none;
  }

  input[type="checkbox"] label:before {
    color: white;
  }
  input[type="checkbox"]:checked + label:after {
    color: blue;
  }

  background: #c8c8fd;
  border: solid 2px white;
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
