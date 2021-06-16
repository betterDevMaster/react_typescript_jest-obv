import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {usePanels} from 'Event/template/Panels'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import IconSelect from 'lib/fontawesome/IconSelect'
import ColorPicker from 'lib/ui/ColorPicker'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const {template, update} = usePanels()

  const updateCheckInLeftPanel = update.object('checkInLeftPanel')
  const updateCheckInRightPanel = update.object('checkInRightPanel')

  return (
    <>
      <SectionTitle>Check In</SectionTitle>
      <Box mb={2}>
        <TextField
          label="Title"
          value={template.checkInTitle}
          onChange={onChangeStringHandler(update.primitive('checkInTitle'))}
          inputProps={{'aria-label': 'check in title'}}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6} item>
            <Box mb={1}>
              <InputLabel>Left Panel</InputLabel>
            </Box>
            <ColorPicker
              label="Background Color"
              color={template.checkInLeftPanel.backgroundColor}
              onPick={updateCheckInLeftPanel('backgroundColor')}
              aria-label="check in left panel background color"
            />
            <Box mb={2}>
              <InputLabel>Background Opacity</InputLabel>
              <Slider
                min={0}
                max={1}
                step={0.1}
                onChange={handleChangeSlider(
                  updateCheckInLeftPanel('backgroundOpacity'),
                )}
                valueLabelDisplay="auto"
                value={template.checkInLeftPanel.backgroundOpacity}
              />
            </Box>
            <ColorPicker
              label="Text Color"
              color={template.checkInLeftPanel.textColor}
              onPick={updateCheckInLeftPanel('textColor')}
              aria-label="check in left panel text color"
            />
          </Grid>
          <Grid xs={12} md={6} item>
            <Box mb={1}>
              <InputLabel>Right Panel</InputLabel>
            </Box>
            <ColorPicker
              label="Background Color"
              color={template.checkInRightPanel.backgroundColor}
              onPick={updateCheckInRightPanel('backgroundColor')}
              aria-label="check in right panel background color"
            />
            <Box mb={2}>
              <InputLabel>Background Opacity</InputLabel>
              <Slider
                min={0}
                max={1}
                step={0.1}
                onChange={handleChangeSlider(
                  updateCheckInRightPanel('backgroundOpacity'),
                )}
                valueLabelDisplay="auto"
                value={template.checkInRightPanel.backgroundOpacity}
              />
            </Box>
            <ColorPicker
              label="Text Color"
              color={template.checkInRightPanel.textColor}
              onPick={updateCheckInRightPanel('textColor')}
              aria-label="check in right panel text color"
            />
          </Grid>
        </Grid>
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
