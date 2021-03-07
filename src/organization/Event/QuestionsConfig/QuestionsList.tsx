import Box from '@material-ui/core/Box'
import QuestionInput from 'Event/Question'
import EditButton from 'organization/Event/QuestionsConfig/EditButton'
import {
  Question,
  registrationOnly,
  useQuestions,
} from 'organization/Event/QuestionsProvider'
import React from 'react'
import {useForm} from 'react-hook-form'

export default function QuestionsList(props: {
  onSelect: (question: Question) => void
}) {
  const {questions} = useQuestions()
  const registrationQuestions = registrationOnly(questions)
  const {control} = useForm()

  return (
    <Box paddingTop={1} paddingBottom={2}>
      {registrationQuestions.map((question, index) => (
        <EditButton onClick={() => props.onSelect(question)} key={question.id}>
          <QuestionInput question={question} index={index} control={control} />
        </EditButton>
      ))}
    </Box>
  )
}
