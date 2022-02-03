import NavButton, {NavButtonProps} from 'Event/Dashboard/components/NavButton'
import styled from 'styled-components'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useToggle} from 'lib/toggle'
import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import BlogPostButtonConfig from 'Event/Dashboard/components/BlogPosts/Buttons/BlogPostButtonConfig'

export default React.memo(
  (props: {
    id: string
    button: NavButtonProps
    index: number
    postId: string
  }) => {
    const {id, button: buttonProps, index, postId} = props
    const isEditMode = useEditMode()
    const {flag: configVisible, toggle: toggleConfig} = useToggle()
    const {flag: showingCopyConfig, toggle: toggleCopyConfig} = useToggle()

    const button = <NavButton {...buttonProps} aria-label="blog post button" />

    if (!isEditMode) {
      return <Box>{button}</Box>
    }

    return (
      <>
        <BlogPostButtonConfig
          postId={postId}
          showing={configVisible}
          onClose={toggleConfig}
          id={id}
          button={buttonProps}
        />
        <BlogPostButtonConfig
          postId={postId}
          showing={showingCopyConfig}
          onClose={toggleCopyConfig}
          button={buttonProps}
        />
        <Draggable draggableId={id} index={index} key={id}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.draggableProps}>
              <DraggableOverlay>
                <Editable onEdit={toggleConfig} onCopy={toggleCopyConfig}>
                  <>
                    <DragHandle handleProps={provided.dragHandleProps} />
                    {button}
                  </>
                </Editable>
              </DraggableOverlay>
            </Box>
          )}
        </Draggable>
      </>
    )
  },
)

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[1]};
`
