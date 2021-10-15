import {useEvent} from 'Event/EventProvider'
import styled from 'styled-components'
import React from 'react'
import {rgba} from 'lib/color'
import {useTemplate} from 'Event/TemplateProvider'

export default function Page(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const {event} = useEvent()
  const template = useTemplate()
  const {emojiPage} = template

  const background = event.emoji_page_background
    ? event.emoji_page_background.url
    : null

  const backgroundRGBColor = rgba(
    emojiPage.backgroundColor || '#FFFFFF',
    emojiPage.backgroundOpacity || 0,
  )
  return (
    <Background
      background={background}
      aria-label="emoji page background"
      isHidden={emojiPage.backgroundHidden}
    >
      <ColorOverlay color={backgroundRGBColor}>
        <Container>{props.children}</Container>
      </ColorOverlay>
    </Background>
  )
}

const Background = styled.div<{
  background: string | null
  isHidden?: boolean
}>`
  ${(props) => (props.isHidden ? '' : `background: url(${props.background});`)}
  display: flex;
  background-size: cover;
  background-position: center;
  position: 'absolute';
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`

const ColorOverlay = styled.div<{
  color: string
}>`
  background-color: ${(props) => props.color};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  width: auto;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 600px;
  }
`
