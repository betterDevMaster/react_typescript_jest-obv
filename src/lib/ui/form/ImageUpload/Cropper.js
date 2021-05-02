import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Croppie from 'croppie'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import 'croppie/croppie.css'

const DEFAULT_WIDTH = 300
const DEFAULT_HEIGHT = 200

const DEFAULT_OPTIONS = {
  showZoomer: true,
  enableOrientation: true,
  mouseWheelZoom: 'ctrl',
  enableExif: true,
  viewport: {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    type: 'square',
  },
  boundary: {
    width: 500,
    height: 500,
  },
}

export default function Cropper({
  image,
  isOpen,
  onCancel,
  onCrop,
  width,
  height,
  canResize,
}) {
  const [croppie, setCroppie] = useState(null)
  const [el, setEl] = useState(null)

  /**
   * Init croppie
   */

  useEffect(() => {
    if (!el || croppie || !isOpen) {
      return
    }

    const activeWidth = width || DEFAULT_WIDTH
    const activeHeight = height || DEFAULT_HEIGHT

    const longestEdge = Math.max(activeWidth, activeHeight)

    const boundaryLength = longestEdge + 100

    const options = {
      ...DEFAULT_OPTIONS,
      viewport: {
        ...DEFAULT_OPTIONS.viewport,
        width: width || DEFAULT_WIDTH,
        height: height || DEFAULT_HEIGHT,
      },
      boundary: {
        width: boundaryLength,
        height: boundaryLength,
      },
      enableResize: Boolean(canResize),
    }

    const c = new Croppie(el, options)
    c.bind({
      url: URL.createObjectURL(image),
    })

    setCroppie(c)
  }, [el, croppie, isOpen, image, width, height, canResize])

  /**
   * Clean-up instance on close
   */

  useEffect(() => {
    if (isOpen || !croppie) {
      return
    }

    croppie.destroy()
    setCroppie(null)
  }, [isOpen, croppie])

  const submitCroppedImage = () => {
    if (croppie === null) {
      onCancel()
      return
    }

    croppie.result({type: 'blob'}).then((blob) => {
      const cropped = blobToFile(blob, image.name)
      onCrop(cropped)
    })
  }

  return (
    <Dialog open={!!isOpen} onClose={onCancel} fullScreen disableEnforceFocus>
      <DialogTitle disableTypography>
        <Typography align="center" variant="h5">
          Re-size Image
        </Typography>
      </DialogTitle>
      <DialogContent>
        <CroppyContainer>
          <div ref={setEl}></div>
        </CroppyContainer>
        <Container maxWidth="sm">
          <Box mb={2}>
            <Button
              color="primary"
              variant="contained"
              onClick={submitCroppedImage}
              aria-label="update image size"
              fullWidth
            >
              Done
            </Button>
          </Box>
          <Box mb={2}>
            <Button
              variant="outlined"
              onClick={onCancel}
              fullWidth
              aria-label="cancel image resize"
            >
              Cancel
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  )
}

function blobToFile(blob, fileName) {
  const newFile = new File([blob], fileName)
  return newFile
}

const CroppyContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
