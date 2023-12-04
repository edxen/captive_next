import styled from 'styled-components';

interface StyledInputGroup {
    value: string;
}

export const StyledHeader = styled.div`
    font-size: 20px;
    color: white;
    text-align: left;
    margin-bottom:10px;

`;

export const StyledInstructions = styled.div`
    color: white;
    text-align: left;
    margin-bottom:10px;
`;

export const StyledInputGroup = styled.div<StyledInputGroup>`
    color: white;
    display:flex;
    flex-direction: column;
    align-items:start;
    justify-content: center;
    width: 100%;
    margin-bottom:5px;

    & label {
        margin-top: 2px;
    }

    & input {
        padding:10px;
        border:${(props) => (props.value !== '' ? '1px solid red' : '1px solid transparent')};
        border-radius:4px;
        width: 100%;
    }

    & input:focus + label {
        color: white;
    }
`;

export const StyledError = styled.div`
    margin-bottom: 10px;

    &:not(:empty){
        color: white;
        padding:5px;
        background-color:red;
        border-radius:4px;
        margin:10px 0;
    }
`;

export const StyledButton = styled.button`
    width: 100%;
    background-color: hsl(280, 100%, 50%);
    border: 1px solid transparent;
    border-radius:6px;
    color: white;
    font-size:16px;
    padding:5px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    & a {
        color:white;
        text-decoration: none;
    }

    &:hover {
        background-color: hsl(280, 100%, 30%);
    }
`;

export const StyledDivider = styled.div`
    margin-bottom: 10px;
`;