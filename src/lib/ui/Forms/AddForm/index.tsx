import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Header from 'lib/ui/Forms/Header'
import {SubHead} from 'lib/ui/typography'
import Button from 'lib/ui/Button'
import CheckBox from 'lib/ui/Checkbox'
import Select from 'lib/ui/Select'
import Option from 'lib/ui/Select/Option'
import TextField from 'lib/ui/TextField'

export default function AddForm() {
  return (
    <Box>
      <Header title="Add Form" hasDiscard />
      <Container>
        <FieldGroup>
          <FormLabel>Form name</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <FieldGroup>
          <CheckBox label="Can edit answer?" checked />
        </FieldGroup>
        <FieldGroup>
          <FormLabel>Resubmit button label</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <FieldGroup>
          <FormLabel>Submit label</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <FieldGroup>
          <FormLabel>Submitted message</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <FieldGroup>
          <FormLabel>Redirect URL (optional)</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <FieldGroup>
          <FormLabel>Submission webhook URL (optional)</FormLabel>
          <TextField variant="outlined" fullWidth />
        </FieldGroup>
        <SelectFieldGroup>
          <Select
            label="Pick an action for points"
            fullWidth
            onChange={() => {}}
          >
            <Option value={0}>None</Option>
          </Select>
        </SelectFieldGroup>
        <Box>
          <QuestionButton variant="contained" color="primary">
            Add Question
          </QuestionButton>
        </Box>
        <Box>
          <DownloadButton variant="outlined" color="primary" borderWidth={1}>
            Download submissions
          </DownloadButton>
        </Box>
        <Box>
          <Button variant="outlined" color="danger" borderWidth={1}>
            Delete Form
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

const Container = styled(Box)`
  max-width: 660px;
`

const FieldGroup = styled(Box)`
  margin-bottom: ${(props) => props.theme.spacing[8]} !important;
`

const SelectFieldGroup = styled(FieldGroup)`
  max-width: 290px;
`

const FormLabel = styled(SubHead)`
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`

const QuestionButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[13]} !important;
`

const DownloadButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[8]} !important;
  border-color: ${(props) => props.theme.colors.disabled} !important;
  color: ${(props) => props.theme.colors.gray200} !important;
`
