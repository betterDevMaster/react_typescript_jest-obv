import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import {HeroConfig} from 'Event/template/Cards/Dashboard/Hero/HeroConfig'
import {useAttendeeVariables} from 'Event'
import {useCards} from 'Event/template/Cards'
import {useToggle} from 'lib/toggle'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function Hero() {
  const {template} = useCards()
  const isEdit = useEditMode()

  if (!isEdit && template.header.isCollapsed) {
    return null
  }

  return (
    <>
      <EditModeOnly>
        <EditButton />
      </EditModeOnly>
      <>
        <WelcomeText />
        <Image />
      </>
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
  const {template} = useCards()
  const {
    hero: {welcomeText, welcomeFontSize, welcomeTextColor},
  } = template
  const v = useAttendeeVariables()

  if (!welcomeText) {
    return null
  }

  return (
    <Text
      aria-label="welcome"
      color={welcomeTextColor}
      fontSize={welcomeFontSize}
    >
      {v(welcomeText)}
    </Text>
  )
}

function Image() {
  const {event} = useEvent()
  const {template} = useCards()
  const {
    hero: {heroImageSize},
  } = template

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
const Text = styled.div<{color: string; fontSize: number}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-weight: 500;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
  &:empty {
    height: ${(props) => props.theme.spacing[5]};
    width: 100%;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: ${(props) => props.fontSize}px;
    font-weight: 500;
    line-height: 2.5;
  }
`

const StyledEditButton = withStyles({
  root: {
    marginTop: spacing[6],
  },
})(Button)
