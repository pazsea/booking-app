import styled, { keyframes } from "styled-components";
import { tada } from "react-animations";

export const Form = styled.form`
  margin-top: 5%;

  h2 {
    font-family: "Montserrat", sans-serif;
    color: wheat;
    font-size: 3em;
    p {
      font-family: "Montserrat", sans-serif;
      font-size: 0.5em;
      color: #97a7b9;
    }
  }
  h4 {
    font-family: "Montserrat", sans-serif;
    color: wheat;
  }
  #searchUser {
    font-family: "Montserrat", sans-serif;
    width: 100%;
    margin: 5% 0;
    padding: 0.5em;
    border-radius: 4px;
    border: none;
  }

  #descriptionInput {
    font-family: "Montserrat", sans-serif;
    width: 100%;
    height: 150px;
    overflow-y: auto;
    padding: 1em;
    border-radius: 4px;
    border: none;
  }
`;

export const TimeSlotBtn = styled.div`
  font-family: "Montserrat", sans-serif;
  display: inline-block;
  width: 10em;
  padding: 0.5em;

  margin: 1%;
  flex-direction: column-reverse;
  color: wheat;
  border-radius: 4px;

  background: #535d69;
  border: none;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;

  :hover {
    background: #5b5b7791;
    cursor: pointer;
  }

  &.chosenTimeSlot {
    background: #050506a8;
  }

  @media screen and (min-width: 1024px) {
    font-family: "Montserrat", sans-serif;
    font-size: 1.2em;
    display: inline-block;
    width: 10em;
    padding: 0.5em;

    margin: 3%;
    flex-direction: column-reverse;
    color: white;
    border-radius: 4px;

    background: #c8c8fd;
    border: solid 2px white;

    :hover {
      background: #5b5b7791;
      cursor: pointer;
    }

    &.chosenTimeSlot {
      background: #050506a8;
    }
  }
`;
export const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  width: 4em;
  /* background-color: #535d69; */
  border-bottom: solid 1px;
  color: wheat;
  border-radius: 4px;
  margin: auto;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;
  text-align: center;
  cursor: pointer;
`;

export const TopButton = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  width: 6em;
  /* background-color: #535d69; */
  border-bottom: solid 1px;
  color: wheat;
  border-radius: 4px;
  margin: auto;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;
  text-align: center;
  cursor: pointer;
`;

export const CustomButton2 = styled.button`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #535d69;
  border: none;
  color: wheat;
  border-radius: 4px;
  margin: 1%;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  text-shadow: 0.03125em 0.03125em 0.09355em #152029;
  cursor: pointer;
`;

export const LoadingDiv = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 1.2em;
  color: white;
`;

export const CustomButton = styled.button`
  font-family: "Montserrat", sans-serif;
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #d2b9bf;
  border: none;
  border-radius: 4px;
  margin: 1%;
  box-shadow: 0.0625em 0.0625em 0.09375em #152029;
  color: black;
  font-weight: 600;
  cursor: pointer;
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
