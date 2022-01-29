import {useSimpleBlogTemplate} from 'Event/template/SimpleBlog'
import React from 'react'
import styled from 'styled-components'

export default React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    className?: string
    disablePaddingX?: boolean
  }
>((props, ref) => {
  const {sidebar} = useSimpleBlogTemplate()

  /**
   * If empty is true, padding should be ignored.
   */
  return (
    <Section
      ref={ref}
      className={props.className}
      color={sidebar.separatorColor}
      width={sidebar.separatorThickness}
      borderStyle={sidebar.separatorStyle}
      disablePaddingX={props.disablePaddingX}
    >
      {props.children}
    </Section>
  )
})

export const SectionBox = styled.div<{
  disablePaddingX?: boolean
  disablePaddingY?: boolean
  disablePaddingBottom?: boolean
}>`
  padding-top: ${(props) =>
    props.disablePaddingY ? 0 : props.theme.spacing[8]};
  padding-right: ${(props) =>
    props.disablePaddingX ? 0 : props.theme.spacing[8]};
  padding-bottom: ${(props) =>
    props.disablePaddingY ? 0 : props.theme.spacing[8]};
  padding-left: ${(props) =>
    props.disablePaddingX ? 0 : props.theme.spacing[8]};
`

const Section = styled(SectionBox)<{
  color: string
  width: number
  borderStyle: string
  disablePaddingX?: boolean
}>`
  border-top: ${(props) =>
    `${props.color} ${props.width}px ${props.borderStyle}`};

  &:first-child {
    border-top: none;
  }
`
