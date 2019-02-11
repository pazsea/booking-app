import styled from "styled-components";

export const Form = styled.form`
  margin-top: 5%;
  h2 {
    color: white;
    p {
      color: red;
    }
  }
  #searchUser {
    width: 100%;
    font-size: 1.2em;
    margin: 5% 0;
  }

  #descriptionInput {
    width: 100%;
    height: 150px;
  }
`;

export const StyledLabel = styled.label`
  display: inline-block;
  font-size: 1.3em;
  margin: 3%;
  padding: 10px;
  flex-direction: column-reverse;
  color: white;
  border: 2px solid black;

  background-color: #17a2b8;
`;

export const CustomButton2 = styled.button`
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #28a745;
`;

/* export const MyInput = styled.form`
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #28a745;
`; */

export const CustomButton = styled.button`
  width: 100%;
  font-size: 1.2em;
  padding: 10px;
  background-color: #dc3545;
`;
