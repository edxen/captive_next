import styled, { keyframes } from 'styled-components';

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;
const Loader = styled.div`
    border: 5px solid #b38446;
    border-top: 5px solid transparent;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${spin} 1s linear infinite;
`;

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;

`;

const Waiting = () => {
    return (
        <Center>
            <h2>This is waiting page</h2>
            <Loader />
            <p>Please wait</p>
        </Center>
    );
};

export default Waiting;