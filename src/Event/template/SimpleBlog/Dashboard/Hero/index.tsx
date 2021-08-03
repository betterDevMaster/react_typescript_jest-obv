import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import {HeroConfig} from 'Event/template/SimpleBlog/Dashboard/Hero/HeroConfig'
import {useVariables} from 'Event'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import {useToggle} from 'lib/toggle'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'

export default function Hero() {
  return (
    <>
      <EditModeOnly>
        <EditButton />
      </EditModeOnly>
      <WelcomeText />
      <Image />
    </>
  )
}

function EditButton() {
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  return (
    <>
      <HeroConfig isVisible={configVisible} onClose={toggleConfig} />
      <StyledEditButton
        onClick={toggleConfig}
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="edit hero"
      >
        Edit Hero
      </StyledEditButton>
    </>
  )
}

function WelcomeText() {
  const {template} = useSimpleBlog()
  const {welcomeText} = template
  const v = useVariables()

  if (!welcomeText) {
    return null
  }

  return <Text aria-label="welcome">{v(welcomeText)}</Text>
}

function Image() {
  const {event} = useEvent()
  const {template} = useSimpleBlog()
  const {heroImageSize} = template

  const size = heroImageSize

  if (!event.welcome_image) {
    return null
  }

  return (
    <ImageBox>
      <ImageSizer size={size}>
        <StyledImg src={event.welcome_image.url} />
      </ImageSizer>
    </ImageBox>
  )
}

const ImageBox = styled.div`
  padding: ${(props) => props.theme.spacing[5]} 0;
`

const ImageSizer = styled.div<{size: number}>`
  width: ${(props) => props.size}%;
  margin: 0 auto;
`
const StyledImg = styled.img`
  width: 100%;
`
const Text = styled.div`
  font-size: 29px;
  font-weight: 400;
  line-height: 1;
  text-transform: uppercase;
  text-align: center;
  &:empty {
    height: ${(props) => props.theme.spacing[5]};
    width: 100%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 42px;
    font-weight: 700;
    line-height: 1.5;
  }
`

const StyledEditButton = withStyles({
  root: {
    marginTop: spacing[6],
  },
})(Button)
