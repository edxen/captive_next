import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    justify-conten: center;
`;

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    
    text-align: center;
    background-color: rgba(0, 0,0 , .4);
    color: white;
    padding: 15px;
    width: 100%;
    min-height: 250px;
    min-width: 320px;
    max-width: 450px;
    border-radius: 4px;

    & > * {
        width: 100%;
    }
`;

export const StyledHeader = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    color: white;

    & div {
        font-size: 28px;
    }
`;


export const StyledLogo = styled.div`
    color: white;
    height: 150px;
    width: 150px;
    background-image: url('/logo.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
`;

export const StyledFooter = styled.div`
    color: rgb(230, 230, 230);
    font-size: 14px;
    margin: 10px;
`;