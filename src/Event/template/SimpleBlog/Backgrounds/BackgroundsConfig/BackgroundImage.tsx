import styled from 'styled-components'

const BackgroundImage = styled.img<{
  borderRadius?: number
  borderThickness?: number
  borderColor: string
  clickable: boolean | undefined
}>`
  border-radius: ${(props) => props.borderRadius || 0}px;
  border-width: ${(props) => props.borderThickness || 0}px;
  border-color: ${(props) => props.borderColor};
  border-style: solid;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
`

export default BackgroundImage
