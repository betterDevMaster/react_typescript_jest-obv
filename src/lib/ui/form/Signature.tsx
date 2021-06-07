import React, {useCallback, useEffect, useRef, useState} from 'react'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import SignaturePad from 'signature_pad'
import {publicAsset} from 'lib/url'
import IconButton from 'lib/ui/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

export default function Signature(props: {
  value: null | string
  onUpdate: (data: string | null) => void
  className?: string
}) {
  const canvasBoxRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const {onUpdate} = props
  const hasValue = Boolean(props.value)
  const [pad, setPad] = useState<null | SignaturePad>(null)

  const createCanvas = useCallback(() => {
    if (!canvasRef.current || !canvasBoxRef.current) {
      throw new Error(`Missing canvas el`)
    }

    /**
     * Canvas el needs width explicitly set or the alignment will be off,
     * we'll use a responsive parent div, and calculate
     * the width based on that.
     *
     * Reference: https://github.com/szimek/signature_pad/issues/268#issuecomment-328837931
     */
    const width = canvasBoxRef.current.clientWidth
    canvasRef.current.setAttribute('width', String(width))

    const pad = new SignaturePad(canvasRef.current)
    setPad(pad)

    pad.onEnd = () => {
      const data = pad.toDataURL()
      onUpdate(data)
    }

    return () => {
      pad.clear()
      pad.off()
      setPad(null)
    }
  }, [onUpdate])

  useEffect(createCanvas, [createCanvas])

  useEffect(() => {
    window.addEventListener('resize', createCanvas)

    return () => {
      window.removeEventListener('resize', createCanvas)
    }
  }, [createCanvas])

  const clear = useCallback(
    withPad(pad, (pad) => {
      pad.clear()
      onUpdate(null)
    }),
    [pad],
  )

  return (
    <Box className={props.className}>
      <CanvasBox ref={canvasBoxRef}>
        <Canvas ref={canvasRef} aria-label="signature canvas" width="300" />
      </CanvasBox>
      <ClearSignatureButton show={hasValue} clear={clear} />
    </Box>
  )
}

function ClearSignatureButton(props: {show: boolean; clear: () => void}) {
  if (!props.show) {
    return null
  }
  return (
    <ClearButton onClick={props.clear}>
      <ClearIcon htmlColor={grey[500]} />
    </ClearButton>
  )
}

function withPad(
  pad: SignaturePad | null,
  handle: (pad: SignaturePad) => void,
) {
  return () => {
    if (!pad) {
      throw new Error(`Pad has not been set`)
    }
    return handle(pad)
  }
}

const Box = styled.div`
  display: inline-block;
  position: relative;
`

const CanvasBox = styled.div`
  width: 300px;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    width: 500px;
  }
`

const Canvas = styled.canvas`
  border-width: 2px;
  border-style: dashed;
  border-color: #706f70;
  background-color: rgb(255, 255, 255);
  cursor: url(${publicAsset('images/pen.cur')}), pointer;
  touch-action: none;
`

const ClearButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`
