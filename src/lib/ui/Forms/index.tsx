import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Button from 'lib/ui/Button'
import Header from './Header'
import FormItem from './FormItem'

export interface Form {
  name: string
}

export type FormsProps = {
  forms: Form[]
}

export default function Forms(props: FormsProps) {
  const {forms} = props

  return (
    <Box>
      <Header title="Forms" />
      <AddButton variant="contained" color="primary">
        Add
      </AddButton>
      <FormsList>
        <FormItem isHeader />
        {forms.map((form) => (
          <FormItem form={form} key={form.name} />
        ))}
      </FormsList>
    </Box>
  )
}

const AddButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]} !important;
`

const FormsList = styled(Box)`
  max-width: 660px;
  border: 1px solid ${(props) => props.theme.colors.gray300} !important;
  border-bottom: none !important;
`
