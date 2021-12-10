import React from 'react'
import {BlogPost, BUTTONS} from 'Event/Dashboard/components/BlogPosts'
import styled from 'styled-components'
import {createPositions, orderedIdsByPosition} from 'lib/list'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import BlogPostButton from 'Event/Dashboard/components/BlogPosts/Buttons/BlogPostButton'
import {useTemplateUpdate} from 'Event/TemplateUpdateProvider'
import AddBlogPostButtonButton from 'Event/Dashboard/components/BlogPosts/Buttons/AddBlogPostButtonButton'

export default function Buttons(props: {post: BlogPost; postId: string}) {
  const {
    post: {buttons, attachment},
    postId,
  } = props
  const isEditMode = useEditMode()
  const ids = orderedIdsByPosition(buttons)

  const buttonComponents = ids.map((id, index) => (
    <ButtonBox key={id}>
      <BlogPostButton
        button={buttons[id]}
        id={id}
        index={index}
        postId={postId}
      />
    </ButtonBox>
  ))

  const showing = attachment === BUTTONS
  if (!showing) {
    return null
  }

  if (isEditMode) {
    return <Draggable {...props}>{buttonComponents}</Draggable>
  }

  return <Container {...props}>{buttonComponents}</Container>
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: JSX.Element | JSX.Element[]
    post: BlogPost
  } & Partial<DroppableProvidedProps>
>((props, ref) => {
  const {
    post: {buttonsPosition, buttonsWidth},
  } = props

  return (
    <Box justifyContent={buttonsPosition} ref={ref}>
      <Sizer width={buttonsWidth}>{props.children}</Sizer>
    </Box>
  )
})

function Draggable(props: {
  children: JSX.Element[]
  className?: string
  post: BlogPost
  postId: string
}) {
  const {postId, post} = props
  const handleDrag = useHandleDrag(postId, post)

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId={`blog_post_${postId}_buttons`}>
        {(provided) => (
          <Container {...props} ref={provided.innerRef} {...provided.innerRef}>
            <>
              {props.children}
              {provided.placeholder}
              <AddBlogPostButtonButton postId={postId} />
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function useHandleDrag(postId: string, post: BlogPost) {
  const update = useTemplateUpdate()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const ids = orderedIdsByPosition(post.buttons)

    const moved = Array.from(ids)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    update({
      blogPosts: {
        [postId]: {
          buttons: createPositions(moved),
        },
      },
    })
  }
}

const ButtonBox = styled.div`
  & button {
    margin: auto;
  }

  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spacing[2]};
  }
`
const Sizer = styled.div<{
  width?: number
}>`
  width: ${(props) => props.width || 100}%;
`
const Box = styled.div<{
  justifyContent?: string
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent || 'center'};
`
