import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import QuestionInput from 'Event/Question'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import EditButton from 'organization/Event/Form/EditButton'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {useForm, UseFormMethods} from 'react-hook-form'

export default function QuestionsList(props: {
  onSelect: (question: Question) => void
}) {
  return (
    <Box paddingTop={1} paddingBottom={2}>
      <Content {...props} />
    </Box>
  )
}

function Content(props: {onSelect: (question: Question) => void}) {
  const {control} = useForm()
  const {questions} = useQuestions()
  const handleDrag = useHandleDrag()

  const hasQuestions = questions.length > 0

  if (!hasQuestions) {
    return <Typography align="center">No questions have been added</Typography>
  }

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="form_questions">
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <QuestionRow
                question={question}
                key={question.id}
                index={index}
                onEdit={() => props.onSelect(question)}
                control={control}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function QuestionRow(props: {
  question: Question
  index: number
  onEdit: () => void
  control: UseFormMethods['control']
}) {
  const {index, question, onEdit, control} = props

  return (
    <Draggable draggableId={`${question.id}`} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <DraggableOverlay>
            <EditButton onClick={onEdit} key={question.id}>
              <>
                <DragHandle handleProps={provided.dragHandleProps} />
                <QuestionInput
                  question={question}
                  index={index}
                  control={control}
                />
              </>
            </EditButton>
          </DraggableOverlay>
        </div>
      )}
    </Draggable>
  )
}

function useHandleDrag() {
  const {questions, setQuestions} = useQuestions()

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(questions)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    setQuestions(moved)
  }
}

const Container = styled.div`
  padding-top: ${(props) => props.theme.spacing[1]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
`
