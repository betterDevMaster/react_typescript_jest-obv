import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import QuestionInput from 'Event/Question'
import EditButton from 'organization/Event/Form/EditButton'
import {Question, useQuestions} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {useForm} from 'react-hook-form'

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

  const hasQuestions = questions.length > 0

  if (!hasQuestions) {
    return <Typography align="center">No questions have been added</Typography>
  }

  return (
    <Box paddingTop={1} paddingBottom={2}>
      {questions.map((question, index) => (
        <EditButton onClick={() => props.onSelect(question)} key={question.id}>
          <QuestionInput question={question} index={index} control={control} />
        </EditButton>
      ))}
    </Box>
  )
}
