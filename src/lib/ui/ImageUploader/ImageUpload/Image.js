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
        <Preview>
          <ImageEl src={src} alt={alt} />
        </Preview>
      </Size>
    )
  }

  if (!current) {
    return null
  }

  return (
    <Size width={width}>
      <Preview>
        <ImageEl src={current.url} alt={current.name} />
      </Preview>
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
  max-width: 100%;
  max-height: 100%;
`

const Box = styled.div`
  width: ${(props) => props.width}px;
`

const Preview = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: ${(props) => props.theme.spacing[4]}
    ${(props) => props.theme.spacing[11]};
  display: inline-flex;
`
