import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Saira-Regular', sans-serif;
  }

  body {
    background-color: #dbe8de;
    background-image: url('/background.webp'); /* Update the path based on your project structure */
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    min-width: 320px;
    margin: 0; /* Reset default margin */
  }

  @font-face {
    font-family: 'Saira-Regular';
    src: url('/fonts/Saira-Regular.eot');
    src: url('/fonts/Saira-Regular.eot?#iefix') format('embedded-opentype'),
        url('/fonts/Saira-Regular.woff2') format('woff2'),
        url('/fonts/Saira-Regular.woff') format('woff'),
        url('/fonts/Saira-Regular.ttf') format('truetype'),
        url('/fonts/Saira-Regular.svg#Saira-Regular') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;