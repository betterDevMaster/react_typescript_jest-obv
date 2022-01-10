import React, {useState, useEffect, useMemo} from 'react'
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

/**
 * Default image resolution if none is specified
 */

const DEFAULT_WIDTH = 300
const DEFAULT_HEIGHT = 200

/**
 * Set the maximum viewport (crop window) size. If this is not limited, the
 * crop window will require the user to scroll.
 */

const MAX_VIEWPORT_WIDTH = 600
const MAX_VIEWPORT_HEIGHT = 400

/**
 * Set the canvas size which should always be larger than either viewport edges.
 */

const canvasSize = (width, height) => Math.max(width, height) + 100

const MAX_CANVAS_SIZE = canvasSize(MAX_VIEWPORT_WIDTH, MAX_VIEWPORT_HEIGHT)

const DEFAULT_OPTIONS = {
  showZoomer: true,
  enableOrientation: true,
  mouseWheelZoom: 'ctrl',
  enableExif: true,
  viewport: {
    width: MAX_VIEWPORT_WIDTH,
    height: MAX_VIEWPORT_HEIGHT,
    type: 'square',
  },
  boundary: {
    width: MAX_CANVAS_SIZE,
    height: MAX_CANVAS_SIZE,
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
  disableWidthResize,
  disableHeightResize,
}) {
  const [croppie, setCroppie] = useState(null)
  const [el, setEl] = useState(null)

  /**
   * Calculate the ratio of width and height for croppied image and use the result to get size(width, height) for cropper.
   * Max Cropper Width: DEFAULT_VIEWPORT_WIDTH
   * Max Cropper Height: DEFAULT_VIEWPORT_HEIGHT
   */

  const viewport = useMemo(() => {
    const imageWidth = width || DEFAULT_WIDTH
    const imageHeight = height || DEFAULT_HEIGHT

    return calculateViewport(imageWidth, imageHeight)
  }, [height, width])

  /**
   * Init croppie
   */

  useEffect(() => {
    if (!el || croppie || !isOpen) {
      return
    }

    const {width: viewPortWidth, height: viewPortHeight} = viewport

    const boundaryLength = canvasSize(viewPortWidth, viewPortHeight)

    const options = {
      ...DEFAULT_OPTIONS,
      viewport: {
        ...DEFAULT_OPTIONS.viewport,
        width: viewPortWidth,
        height: viewPortHeight,
      },
      boundary: {
        width: boundaryLength,
        height: boundaryLength,
      },
      enableResize: Boolean(canResize),
      resizeControls: {
        width: !disableWidthResize,
        height: !disableHeightResize,
      },
    }

    const c = new Croppie(el, options)
    c.bind({
      url: URL.createObjectURL(image),
    })

    setCroppie(c)
  }, [
    el,
    croppie,
    isOpen,
    image,
    width,
    height,
    canResize,
    disableWidthResize,
    disableHeightResize,
    viewport,
  ])

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

    // Croppie is expecting the final crop size to be the actual viewport size
    // in pixels. Since we're hacking the viewport to be responsive, this
    // messes with the size. Setting it to 'original' will keep the
    // resolution, but results in wasted image size, so if the
    // size was fixed, we'll just use the specified size.
    const hasFixedSize = !canResize && width && height
    const size = hasFixedSize ? {width, height} : 'original'

    croppie.result({type: 'blob', size}).then((blob) => {
      const cropped = blobToFile(blob, image.name)
      onCrop(cropped)
    })
  }

  return (
    <Dialog
      open={!!isOpen}
      onClose={onCancel}
      disableEnforceFocus
      maxWidth="lg"
    >
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

export function calculateViewport(width, height) {
  const widthRatio = width / MAX_VIEWPORT_WIDTH
  const heightRatio = height / MAX_VIEWPORT_HEIGHT

  const maxRatio = Math.max(widthRatio, heightRatio)

  if (maxRatio < 1) {
    // Below viewport limits...
    return {
      width,
      height,
    }
  }

  return {
    width: width / maxRatio,
    height: height / maxRatio,
  }
}

const CroppyContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[4]};
`
