import {Sponsor} from 'Event/SponsorPage'
import styled from 'styled-components'
import React, {useState} from 'react'
import ConfigDialog from 'Event/template/FiftyBlog/Dashboard/Sponsors/SponsorList/Card/Image/ConfigDialog'

const SPONSOR_PLACEHOLDER = 'http://placehold.jp/300x100.png'

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
      <Content {...props} onClick={toggleDialog} />
    </>
  )
}

function Content(
  props: ImageProps & {
    onClick?: () => void
  },
) {
  const {sponsor} = props
  const alt = sponsor.name

  if (!sponsor.image && !props.isEditMode) {
    return null
  }

  const src = sponsor.image?.url || SPONSOR_PLACEHOLDER

  return (
    <ImageBox className={props.className}>
      <ImageEl
        src={src}
        alt={alt}
        aria-label="sponsor image"
        onClick={props.onClick}
        clickable={Boolean(props.onClick)}
      />
    </ImageBox>
  )
}

const ImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 50%;
  }
`

const ImageEl = styled.img<{
  clickable?: boolean
}>`
  cursor: ${(props) => (props.clickable ? 'points' : 'default')};
`
