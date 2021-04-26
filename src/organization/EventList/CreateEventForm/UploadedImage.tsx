import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import React from 'react'
import {PublicFile} from 'lib/http-client'

export default function UploadedImage(props: {
  image: PublicFile | null
  onRemove: () => void
}) {
  if (!props.image) {
    return null
  }

  return (
    <Box>
      <img src={props.image.url} alt={props.image.name} />
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
