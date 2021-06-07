import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {usePanels} from 'Event/template/Panels'
import {onChangeStringHandler} from 'lib/dom'
import IconSelect from 'lib/fontawesome/IconSelect'
import ColorPicker from 'lib/ui/ColorPicker'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const {template, update} = usePanels()

  return (
    <>
      <SectionTitle>Check In</SectionTitle>
      <Box mb={2}>
        <TextField
          label="Check In Title"
          value={template.checkInTitle}
          onChange={onChangeStringHandler(update.primitive('checkInTitle'))}
          inputProps={{'aria-label': 'check in title'}}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Panel Color"
          color={template.checkInPanelColor}
          onPick={update.primitive('checkInPanelColor')}
          aria-label="check in panel color"
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Step Label Color"
          color={template.stepLabelColor}
          onPick={update.primitive('stepLabelColor')}
          aria-label="step label color"
        />
      </Box>
      <StepConfig
        inputLabel="Step 1"
        label={template.step1Label}
        icon={template.step1Icon}
        onChangeLabel={update.primitive('step1Label')}
        onChangeIcon={update.primitive('step1Icon')}
      />
      <StepConfig
        inputLabel="Step 2"
        label={template.step2Label}
        icon={template.step2Icon}
        onChangeLabel={update.primitive('step2Label')}
        onChangeIcon={update.primitive('step2Icon')}
      />
      <StepConfig
        inputLabel="Step 3"
        label={template.step3Label}
        icon={template.step3Icon}
        onChangeLabel={update.primitive('step3Label')}
        onChangeIcon={update.primitive('step3Icon')}
      />
    </>
  )
}

function StepConfig(props: {
  inputLabel: string
  label: string
  icon: string | null
  onChangeLabel: (label: string) => void
  onChangeIcon: (icon: string | null) => void
}) {
  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid xs={6} item>
            <TextField
              label={props.inputLabel}
              value={props.label}
              onChange={onChangeStringHandler(props.onChangeLabel)}
              inputProps={{'aria-label': props.inputLabel}}
              fullWidth
            />
          </Grid>
          <Grid xs={6} item>
            <IconSelect value={props.icon} onChange={props.onChangeIcon} />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
