import React from 'react'
import DefaultButtonFields from 'Event/template/Panels/Step3/TechCheckConfig/TemplateFields/DefaultButtonFields'
import CustomButtonFields from 'Event/template/Panels/Step3/TechCheckConfig/TemplateFields/CustomButtonFields'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {Panels} from 'Event/template/Panels'

export type TechCheckTemplateProps = NonNullable<Panels['techCheck']>

type TechCheckTemplatePropSetter = <K extends keyof TechCheckTemplateProps>(
  key: K,
) => (value: TechCheckTemplateProps[K]) => void

export interface TemplateFieldProps {
  techCheck: TechCheckTemplateProps
  set: TechCheckTemplatePropSetter
  submitting: boolean
}

export default function TemplateFields(props: TemplateFieldProps) {
  const {techCheck, set} = props

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6">Buttons</Typography>
      </Box>
      <Box mb={2}>
        <ToggleButtonGroup
          value={techCheck.hasCustomButtons ? 'true' : 'false'}
          exclusive
        >
          <ToggleButton
            value="false"
            onClick={() => set('hasCustomButtons')(false)}
          >
            Default
          </ToggleButton>
          <ToggleButton
            value="true"
            aria-label="set custom buttons"
            onClick={() => set('hasCustomButtons')(true)}
          >
            Custom
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ButtonFields {...props} />
    </>
  )
}

function ButtonFields(props: TemplateFieldProps) {
  const {techCheck} = props

  if (techCheck.hasCustomButtons) {
    return <CustomButtonFields {...props} />
  }

  return <DefaultButtonFields {...props} />
}
