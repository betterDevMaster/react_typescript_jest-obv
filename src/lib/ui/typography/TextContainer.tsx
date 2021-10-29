import {breakpoints} from 'lib/ui/theme'
import React from 'react'
import styled from 'styled-components'

/**
 * TextContainer is a container to make sure text always stays
 * readable even at large widths.
 *
 * @param props
 * @returns
 */
export default function TextContainer(props: {
  children: React.ReactElement | string
}) {
  return <Box>{props.children}</Box>
}

const Box = styled.div`
  max-width: ${breakpoints.sm};
`
