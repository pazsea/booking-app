import styled from "styled-components";

export const SpanArrow = styled.span`
  i {
    color: white;
    position:absolute;

    :hover {
      color: gold;
      cursor: pointer;
    }
  }
`;

export const Nav = styled.div`
         position: relative;
         margin: 0;
         padding: 0;
         width: 100%;
         height: ${props => (props.stateNav ? "100px" : "0px")};
         overflow: auto;
         display: flex;

         background-color: beige;
         transition: height 0.5s;
         transition: padding 0.5s;
         justify-content: center;
         /*   @media screen and (max-width: 700px) {
    height: 0;
    padding: 0;
  } */
         ul {
           min-width: 90%;
           width: fit-content;
           justify-content: center;
           padding: 5px;
           display: flex;
           list-style: none;
           border: 2px solid green;

           @media screen and (max-width: 700px) {flex-direction: column;
             justify-content: center;
             align-items: center;}
         }
         li {
           margin: 5px 5px;
           background: #28d;
           border-color: transparent;
           color: #fff;
           cursor: pointer;
           border-radius: 10px;
           padding: 12px;
           text-transform: uppercase;
           height: fit-content;
           :active {
             background-color: #4caf50;
             color: white;
           }
           :hover {
             background: #17c;
           }
           :focus {
             border-color: #05a;
           }
           @media screen and (max-width: 700px) {width: 40%;
             text-align: center;}
         }`;
