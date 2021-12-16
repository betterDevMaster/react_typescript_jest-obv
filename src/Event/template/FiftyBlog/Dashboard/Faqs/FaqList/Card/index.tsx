import React from 'react'
import {FAQ} from 'Event/FaqPage'
import Body from 'Event/template/FiftyBlog/Dashboard/Faqs/FaqList/Card/Body'
import {Draggable} from 'react-beautiful-dnd'

export const DEFAULT_DESCRIPTION = ''
export const DEFAULT_TITLE = 'FAQ'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT = 'Back to Dashboard'
export const DEFAULT_BACK_TO_DASHBOARD_TEXT_COLOR = '#000000'

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
