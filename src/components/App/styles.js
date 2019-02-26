import styled from "styled-components";

export const Application = styled.div`
  width: 100%;
  background: #f1f1f1;
  margin: 0;
  padding: 0;
`;

export const Menu = styled.div`
  width: 100%;
  height: 76px;
  background-color: #121c24;
  border-bottom: 2px solid #192530;
`;

export const MenuButton = styled.div`
  position: relative;
  display: flex;
  width: 25%;
  height: 76px;
  margin: auto 0;
  padding-left: 10px;
  border-bottom: 2px solid #192530;
  transition: 0.2s;
  animation: fadein 0.3s;

  i {
    color: #f1f1f1;
    z-index: 2;
    margin: auto 0;

    :hover {
      color: #3b95bc;
      cursor: pointer;
    }
  }
`;
