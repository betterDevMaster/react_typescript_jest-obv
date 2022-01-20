import React from 'react'
import styled from 'styled-components'

export default function Image({
  selected,
  current,
  alt,
  width,
  isVisible,
  children,
}) {
  if (!isVisible) {
    return null
  }

  if (Boolean(selected)) {
    const src = URL.createObjectURL(selected)
    return (
      <Size width={width}>
        <Preview>
          <ImageEl src={src} alt={alt} />
          {children}
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
        {children}
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
  width: 100px;
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
  justify-content: flex-end;
  margin-left: ${(props) => props.theme.spacing[6]};
  margin-right: ${(props) => props.theme.spacing[6]};
`
