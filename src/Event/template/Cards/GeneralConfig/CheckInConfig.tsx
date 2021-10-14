import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {useCards} from 'Event/template/Cards'
import {onChangeStringHandler} from 'lib/dom'
import IconSelect from 'lib/fontawesome/IconSelect'
import ColorPicker from 'lib/ui/ColorPicker'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const {template, update} = useCards()

  const updateCheckIn = update.object('checkIn')

  return (
    <>
      <SectionTitle>Check In</SectionTitle>
      <Box mb={2}>
        <TextField
          label="Title"
          value={template.checkIn.title}
          onChange={onChangeStringHandler(updateCheckIn('title'))}
          inputProps={{'aria-label': 'check in title'}}
          fullWidth
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Step Label Color"
            color={template.checkIn.stepLabelColor}
            onPick={updateCheckIn('stepLabelColor')}
            aria-label="step label color"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ColorPicker
            label="Step Inactive Color"
            color={template.checkIn.inActiveColor}
            onPick={updateCheckIn('inActiveColor')}
            aria-label="step inactive color"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <StepConfig
          inputLabel="Step 1"
          label={template.checkIn.step1Label}
          icon={template.checkIn.step1Icon}
          onChangeLabel={updateCheckIn('step1Label')}
          onChangeIcon={updateCheckIn('step1Icon')}
        />
        <StepConfig
          inputLabel="Step 2"
          label={template.checkIn.step2Label}
          icon={template.checkIn.step2Icon}
          onChangeLabel={updateCheckIn('step2Label')}
          onChangeIcon={updateCheckIn('step2Icon')}
        />
        <StepConfig
          inputLabel="Step 3"
          label={template.checkIn.step3Label}
          icon={template.checkIn.step3Icon}
          onChangeLabel={updateCheckIn('step3Label')}
          onChangeIcon={updateCheckIn('step3Icon')}
        />
      </Grid>
    </>
  )
}

function StepConfig(props: {
  inputLabel: string
  label: string
  icon: string
  onChangeLabel: (label: string) => void
  onChangeIcon: (icon: string) => void
}) {
  const handleIconSelect = (icon: string | null) => {
    if (!icon) {
      return
    }

    props.onChangeIcon(icon)
  }

  return (
    <>
      <Grid item spacing={2} xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid xs={12} md={12} item>
            <TextField
              label={props.inputLabel}
              value={props.label}
              onChange={onChangeStringHandler(props.onChangeLabel)}
              inputProps={{'aria-label': props.inputLabel}}
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={12} item>
            <IconSelect value={props.icon} onChange={handleIconSelect} />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
