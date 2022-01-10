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

  *::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  *::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
  }

  *::-webkit-scrollbar-thumb {
      background: #303c54db;
      border: 1px solid #2b3654;
      border-radius: 5px;
      transition: .5s;
  }

  *::-webkit-scrollbar-thumb:hover {
      background: #142449;
      cursor: pointer;
  }

  *::-webkit-scrollbar-thumb:active {
      background: #142449;
  }

  *::-webkit-scrollbar-track {
      background: #dfdfdf;
      border-left: 1px solid #c8c9cd8f;
      border-radius: 5px;
  }

  *::-webkit-scrollbar-track:hover {
      background: #c3c0c0;
  }

  *::-webkit-scrollbar-track:active {
      background: #c3c0c0;
  }

  *::-webkit-scrollbar-corner {
      background: transparent;
  }

  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-base-border);
  }
`
