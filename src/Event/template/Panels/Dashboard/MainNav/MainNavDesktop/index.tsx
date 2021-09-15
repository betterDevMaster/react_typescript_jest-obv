import styled from 'styled-components'
import React from 'react'
import {DroppableProvidedProps} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import BodyEditable from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop/BodyEditable'
import BodyLive from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop/BodyLive'

export default function MainNavDesktop(props: {className?: string}) {
  const isEditMode = useEditMode()

  if (!isEditMode) {
    return <BodyLive className={props.className} />
  }

  return <BodyEditable className={props.className} />
}

export const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children?: React.ReactElement | React.ReactElement[]
    canScroll?: boolean
  } & Partial<DroppableProvidedProps>
>((props, ref) => {
  return (
    <Box
      className={props.className}
      ref={ref}
      {...props}
      id="main-nav"
      canScroll={props.canScroll}
    >
      <Inner>{props.children}</Inner>
    </Box>
  )
})

const Box = styled.div<{
  canScroll?: boolean
}>`
  flex: 1;
  display: flex;
  overflow: ${(props) => (props.canScroll ? 'auto' : 'hidden')};

  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
`

const Inner = styled.div`
  margin: auto;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  /**
   * Relative position to contain sizer which is absolute.
   */
  position: relative;
`
