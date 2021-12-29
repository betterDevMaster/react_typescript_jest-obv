import styled from 'styled-components'

const BackgroundImage = styled.img<{
  borderRadius: number
  borderThickness: number
  borderColor: string
  clickable: boolean | undefined
}>`
  border-radius: ${(props) => props.borderRadius}px;
  border-width: ${(props) => props.borderThickness}px;
  border-color: ${(props) => props.borderColor};
  border-style: solid;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
`

export default BackgroundImage
