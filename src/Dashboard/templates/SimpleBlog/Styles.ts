import {createGlobalStyle} from 'styled-components'

const SimpleBlogStyles = createGlobalStyle`

html, body, #root {
  height: 100%;
}

body {
  font-family: Arial, 'Times New Roman', Verdana;
  font-size: 17px;
}

a {
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}
`

export default SimpleBlogStyles
