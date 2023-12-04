import styled from 'styled-components';
import { StringKey } from '../components/inteface';

const palette: StringKey = {
    white: "rgb(255, 255, 255)",
    black: "rgba(0, 0, 0, 0.8)",
    mute: "gray",
    primary: "rgb(255, 189, 89)",
    secondary: "rgb(253, 135, 12)",
    alternate: "rgb(64, 84, 89)",
    background: "rgb(219, 232, 222)",
    error: "rgb(255, 0, 0)"
};

interface StyledInputGroup {
    value: string;
}

export const StyledHeader = styled.div`
    font-size: 20px;
    color: ${palette.white};
    text-align: left;
    margin-bottom:10px;

`;

export const StyledInstructions = styled.div`
    color: ${palette.white};
    text-align: left;
    margin-bottom:10px;
`;

export const StyledInputGroup = styled.div<StyledInputGroup>`
    color: ${palette.white};
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
        border:${(props) => (props.value !== '' ? '1px solid ' + palette.error : '1px solid transparent')};
        border-radius:4px;
        width: 100%;
    }

    & input:focus + label {
        color: ${palette.white};
    }
`;

export const StyledError = styled.div`
    margin-bottom: 10px;

    &:not(:empty){
        color: ${palette.white};
        padding:5px;
        background-color:${palette.error};
        border-radius:4px;
        margin:10px 0;
    }
`;

export const StyledButton = styled.button`
    width: 100%;
    background-color: ${palette.primary};
    color: ${palette.black};
    border: 1px solid transparent;
    border-radius:6px;
    font-size:16px;
    padding:5px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    & a {
        color: ${palette.white};
        text-decoration: none;
    }

    &:hover {
        background-color: ${palette.secondary};
    }
`;

export const StyledDivider = styled.div`;
    margin: bottom: 10px;
`;;