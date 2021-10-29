import {createGlobalStyle} from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    font-size: 16px;
    line-height: 1.4;
    font-family:'Rubik', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
      '"Helvetica Neue"', 'Arial', 'sans-serif', '"Apple Color Emoji"',
      '"Segoe UI Emoji"', '"Segoe UI Symbol"';
  }

  a {
    text-decoration: none;
  }
`
