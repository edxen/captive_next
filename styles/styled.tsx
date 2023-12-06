import styled from 'styled-components';

interface Palette {
    [key: string]: string;
}

const palette: Palette = {
    white: "rgb(255, 255, 255)",
    black: "rgba(0, 0, 0, 0.8)",
    mute: "rgb(230, 230, 230)",
    primary: "rgb(255, 189, 89)",
    secondary: "rgb(253, 135, 12)",
    alternate: "rgb(64, 84, 89)",
    background: "rgb(219, 232, 222)",
    black40: "rgba(0, 0, 0 , .4)",
    error: "rgb(255, 0, 0)"
};

const flexColumnCenterStyle = `
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;
`;

const color = (value: string) => `
    color: ${palette[value]};
`;

export const StyledContainer = styled.div`
    ${flexColumnCenterStyle};
    ${color('white')};
`;

export const StyledContent = styled.div`
    ${flexColumnCenterStyle};
    background-color: ${palette.black40};
    
    text-align: center;
    width: 100%;
    padding: 15px;
    min-height: 250px;
    min-width: 320px;
    max-width: 450px;
    border-radius: 4px;

    & > * {
        width: 100%;
    }
`;

export const StyledLogo = styled.div`
    background-image: url('/logo.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    height: 150px;
    width: 150px;
`;

export const StyledFooter = styled.div`
    ${color('mute')};

    font-size: 14px;
    margin: 10px;
`;

export const StyledHeader = styled.div`
    ${flexColumnCenterStyle}

    & div {
        font-size: 28px;
    }
`;

export const StyledTitle = styled.div`
    font-size: 20px;
    text-align: left;
    margin-bottom:10px;

`;

export const StyledInstructions = styled.div`
    text-align: left;
    margin-bottom:10px;
`;

export const StyledInputGroup = styled.div<{ value: string; }>`
    ${flexColumnCenterStyle}

    align-items:start;
    margin-bottom:5px;
    width: 100%;

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
        ${color('white')};
    }
`;

export const StyledRadioGroup = styled.div`
    & > li {
        list-style:none;
        width: 100%;
        margin-bottom: 10px;
    }

    & label {
        display: flex;
        align-items: center;
        width: 100%;
        cursor: pointer;
    }

    & input {
        display: none;
    }

    & input + div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        text-align: left;
        padding: 5px 10px;
        border: 1px solid ${palette.white};
        border-radius: 4px;
        transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out ;
    }
    
    & input:hover + div {
        border: 1px solid ${palette.secondary};
        ${color('secondary')};
    }
    
    & input:checked + div {
        background-color: ${palette.secondary};
        border-color: ${palette.secondary};
        ${color('white')};
    }
`;


export const StyledSelectGroup = styled.div`
    display: flex;

    & label, select {        
        padding: 5px;
        width: fit-content;
    }

    & select {
        border-radius: 4px;
        flex: 1;
    }
`;

export const StyledList = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0 20px;
    margin-bottom: 10px;

    & > div {
        display:flex;
        justify-content: start;
        align-items: center;
    }

    & > div > label {
        text-align: start;
        width: 50%;
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
    ${color('black')};

    width: 100%;
    background-color: ${palette.primary};

    border: 1px solid transparent;
    border-radius:6px;
    font-size:16px;
    padding:5px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    & a {
        color: ${palette.white};
        text-decoration: none;
    }

    &:hover {
        background-color: ${palette.secondary};
        color: ${palette.white};
    }
`;

export const StyledDivider = styled.div`
    margin-bottom: 10px;
`;