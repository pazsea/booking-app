import styled from "styled-components";

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
