import {Sponsor} from 'Event/SponsorPage'
import styled from 'styled-components'
import React, {useState} from 'react'
import ConfigDialog from 'Event/template/SimpleBlog/SponsorPage/SponsorList/Card/Image/ConfigDialog'
import Clickable from 'lib/ui/Editable'

export const SPONSOR_PLACEHOLDER = 'http://placehold.jp/600x600.png'

type ImageProps = {
  sponsor: Sponsor
  isEditMode?: boolean
  className?: string
}

export default function Image(props: ImageProps) {
  if (props.isEditMode) {
    return <WithEditDialog {...props} />
  }

  return <Content {...props} />
}

function WithEditDialog(props: ImageProps) {
  const [dialogVisible, setDialogVisible] = useState(false)

  const toggleDialog = () => setDialogVisible(!dialogVisible)

  return (
    <>
      <ConfigDialog
        visible={dialogVisible}
        sponsor={props.sponsor}
        onClose={toggleDialog}
      />
      <Clickable onClick={toggleDialog}>
        <Content {...props} />
      </Clickable>
    </>
  )
}

function Content(props: ImageProps) {
  const {sponsor} = props
  const alt = sponsor.name

  if (!sponsor.image) {
    // Placeholder
    return (
      <ImageBox className={props.className}>
        <img
          src={SPONSOR_PLACEHOLDER}
          alt={alt}
          aria-label="sponsor placeholder image"
        />
      </ImageBox>
    )
  }

  return (
    <ImageBox className={props.className}>
      <img src={sponsor.image.url} alt={alt} aria-label="sponsor image" />
    </ImageBox>
  )
}

const ImageBox = styled.div`
  img {
    width: 100%;
  }
`
