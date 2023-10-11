import styled from "styled-components";

const Option = styled.div`
    color: black; 
    padding: 10px; 
    font-size: 16px; 
    cursor: pointer;
    width: -webkit-fill-available;
    border-bottom: '1px solid #ccc';
    &:hover {
        background-color: #ccc;
    }
`

export  default Option;