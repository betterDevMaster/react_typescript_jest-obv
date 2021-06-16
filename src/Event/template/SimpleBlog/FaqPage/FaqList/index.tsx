import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import Card from 'Event/template/SimpleBlog/FaqPage/FaqList/Card'
import React from 'react'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function FaqList(props: {
  className?: string
  faqs: FAQ[]
  isEditMode?: boolean
}) {
  const handleDrag = useHandleDrag()
  const sortedFaqs = useSortedFaqs(props.faqs)

  const isEmpty = props.faqs.length === 0
  if (isEmpty) {
    return <Typography align="center">No faq have been added</Typography>
  }

  const faqs = sortedFaqs.map((faq, index) => (
    <HiddenOnMatch rules={faq.settings?.rules} key={faq.id}>
      <Card faq={faq} isEditMode={props.isEditMode} index={index} />
    </HiddenOnMatch>
  ))

  if (!props.isEditMode) {
    return <Box className={props.className}>{faqs}</Box>
  }

  return (
    <DragDropContext onDragEnd={handleDrag(sortedFaqs)}>
      <Droppable droppableId="drag-and-drop-faq">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={props.className}
          >
            <>
              {faqs}
              {provided.placeholder}
            </>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

/**
 *
 * Sort fAQ by a list of ordered ids in the template. Saving the order at the
 * page level allows us to save once instead of updating every FAQ model. We
 * use the list of FAQ as the source of truth, and only sort on match.
 *
 * @param faqs
 * @returns
 */
function useSortedFaqs(faqs: FAQ[]) {
  const {
    template: {faq: pageSettings},
  } = useSimpleBlog()

  const order = pageSettings?.orderedIds || []

  return faqs.sort((a, b) => {
    const aPosition = order.indexOf(a.id)
    const bPosition = order.indexOf(b.id)

    if (aPosition < bPosition) {
      return -1
    }

    if (aPosition > bPosition) {
      return 1
    }

    // Index not found, any order is fine
    return 0
  })
}

function useHandleDrag() {
  const simpleBlog = useSimpleBlog()
  const update = simpleBlog.update.object('faq')

  return (faqs: FAQ[]) => (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(faqs)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    const orderedIds = moved.map((f) => f.id)
    update('orderedIds')(orderedIds)
  }
}

const Box = styled.div`
  width: 100%;
`
