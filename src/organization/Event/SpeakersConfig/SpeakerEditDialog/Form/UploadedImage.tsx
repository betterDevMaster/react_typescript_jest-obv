import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {Speaker} from 'Event'
import React from 'react'

export default function UploadedImage(props: {
  image: File | null
  speaker: Speaker
  onRemove: () => void
}) {
  if (!props.image) {
    return null
  }

  const data = URL.createObjectURL(props.image)

  return (
    <Box>
      <img src={data} alt={props.image.name} />
      <Button onClick={props.onRemove} variant="outlined" size="small">
        clear
      </Button>
    </Box>
  )
}

const Box = styled.div`
  width: 200px;
  margin-top: ${(props) => props.theme.spacing[3]};

  img {
    width: 100%;
    max-height: 100%;
  }
`
