import React from 'react'
import styled from 'styled-components'
import {useEvent} from 'Event/EventProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {useEditComponent} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import {DEFAULT_HERO_IMAGE_SIZE_PERCENT} from 'Event/template/SimpleBlog/Dashboard/Hero/HeroConfig'
import {useVariables} from 'Event'

export const HERO = 'Hero'

export default function Hero() {
  return (
    <>
      <EditButton />
      <WelcomeText />
      <Image />
    </>
  )
}

function EditButton() {
  const edit = useEditComponent({type: HERO})

  return (
    <EditModeOnly>
      <StyledEditButton
        onClick={edit}
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="edit hero"
      >
        Edit Hero
      </StyledEditButton>
    </EditModeOnly>
  )
}

function WelcomeText() {
  const {welcomeText} = useTemplate()
  const v = useVariables()

  if (!welcomeText) {
    return null
  }

  return (
    <Text aria-label="welcome">
      <div
        dangerouslySetInnerHTML={{
          __html: v(welcomeText),
        }}
      />
    </Text>
  )
}

function Image() {
  const {event} = useEvent()
  const {heroImageSize} = useTemplate()

  const size = heroImageSize || DEFAULT_HERO_IMAGE_SIZE_PERCENT

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
