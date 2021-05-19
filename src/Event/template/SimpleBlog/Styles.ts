import {createGlobalStyle} from 'styled-components'

const SimpleBlogStyles = createGlobalStyle<{
  linkUnderline: boolean
  linkColor: string
  color: string
}>`

html, body, #root {
  height: 100%;
}

body {
  font-family: Arial, 'Times New Roman', Verdana;
  font-size: 17px;
  color: ${(props) => props.color};
}

a {
    color: ${(props) => props.linkColor};
  text-decoration: none;
  
  &:hover {
    text-decoration: ${(props) => (props.linkUnderline ? 'underline' : 'none')};
  }
}

p {
  margin-top: 0;
  margin-bottom: ${(props) => props.theme.spacing[4]};
}

`

export default SimpleBlogStyles
