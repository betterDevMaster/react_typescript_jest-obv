import React from 'react'
import styled from 'styled-components'

export default function Image({selected, current, alt, width, isVisible}) {
  if (!isVisible) {
    return null
  }

  if (Boolean(selected)) {
    const src = URL.createObjectURL(selected)
    return (
      <Size width={width}>
        <ImageEl src={src} alt={alt} />
      </Size>
    )
  }

  if (!current) {
    return null
  }

  return (
    <Size width={width}>
      <ImageEl src={current.url} alt={current.name} />
    </Size>
  )
}

function Size({width, children}) {
  if (!width) {
    return children
  }

  return <Box width={width}>{children}</Box>
}

const ImageEl = styled.img`
  width: 100%;
  max-height: 100%;
`

const Box = styled.div`
  width: ${(props) => props.width}px;
`
