import React from 'react'
import {FAQ} from 'Event/FaqPage'
import Body from 'Event/template/Cards/Faqs/FaqList/Card/Body'
import {Draggable} from 'react-beautiful-dnd'

export default function Card(props: {
  index: number
  faq: FAQ
  isEditMode?: boolean
  className?: string
}) {
  const {faq, isEditMode, index} = props

  if (!isEditMode) {
    return (
      <div aria-label="faq" className={props.className}>
        <Body faq={faq} isEditMode={props.isEditMode} />
      </div>
    )
  }

  return (
    <Draggable draggableId={String(props.faq.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          aria-label="faq"
          className={props.className}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Body faq={faq} isEditMode={props.isEditMode} />
        </div>
      )}
    </Draggable>
  )
}
