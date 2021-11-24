import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import {
  DEFAULTS,
  Panels,
  usePanelsTemplate,
  usePanelsUpdate,
} from 'Event/template/Panels'
import {handleChangeSlider} from 'lib/dom'
import IconSelect from 'lib/fontawesome/IconSelect'
import ColorPicker from 'lib/ui/ColorPicker'
import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'
import Button from '@material-ui/core/Button'
import {Control, Controller, FieldElement, useForm} from 'react-hook-form'

export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const update = usePanelsUpdate()
  const template = usePanelsTemplate()

  const {handleSubmit, control, register} = useForm()

  const submit = (data: Panels) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <form onSubmit={handleSubmit(submit)}>
          <SectionTitle>Check In</SectionTitle>
          <Box mb={2}>
            <TextField
              label="Title"
              name="checkInTitle"
              defaultValue={template.checkInTitle}
              inputProps={{
                'aria-label': 'check in title',
                ref: register,
              }}
              fullWidth
            />
          </Box>
          <Box mb={2}>
            <Grid container spacing={2}>
              <Grid xs={12} md={6} item>
                <Box mb={1}>
                  <InputLabel>Left Panel</InputLabel>
                </Box>
                <Controller
                  name="checkInLeftPanel.backgroundColor"
                  defaultValue={template.checkInLeftPanel.backgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Background Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in left panel background color"
                    />
                  )}
                />

                <Box mb={2}>
                  <InputLabel>Background Opacity</InputLabel>
                  <Controller
                    name="checkInLeftPanel.backgroundOpacity"
                    defaultValue={template.checkInLeftPanel.backgroundOpacity}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        key={`checkInLeftPanel-backgroundOpacity-${value}`}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={handleChangeSlider(onChange)}
                        valueLabelDisplay="auto"
                        defaultValue={value}
                      />
                    )}
                  />
                </Box>
                <Controller
                  name="checkInLeftPanel.textColor"
                  defaultValue={template.checkInLeftPanel.textColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in left panel text color"
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} md={6} item>
                <Box mb={1}>
                  <InputLabel>Right Panel</InputLabel>
                </Box>
                <Controller
                  name="checkInRightPanel.backgroundColor"
                  defaultValue={template.checkInRightPanel.backgroundColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Background Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in right panel background color"
                    />
                  )}
                />

                <Box mb={2}>
                  <InputLabel>Background Opacity</InputLabel>

                  <Controller
                    name="checkInRightPanel.backgroundOpacity"
                    defaultValue={template.checkInRightPanel.backgroundOpacity}
                    control={control}
                    render={({value, onChange}) => (
                      <Slider
                        key={`checkInRightPanel-backgroundOpacity-${value}`}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={handleChangeSlider(onChange)}
                        valueLabelDisplay="auto"
                        defaultValue={value}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="checkInRightPanel.textColor"
                  defaultValue={template.checkInRightPanel.textColor}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="check in right panel text color"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={2}>
            <Controller
              name="stepLabelColor"
              defaultValue={template.stepLabelColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Step Label Color"
                  color={value}
                  onPick={onChange}
                  aria-label="step label color"
                />
              )}
            />

            <ColorPicker
              label="Step Label Color"
              color={template.stepLabelColor}
              onPick={(value) => update({stepLabelColor: value})}
              aria-label="step label color"
            />
          </Box>
          <StepConfig
            inputLabel="Step 1"
            label={template.step1Label}
            icon={template.step1Icon || DEFAULTS.step1Icon}
            labelFieldName="step1Label"
            iconFieldName="step1Icon"
            control={control}
            register={register}
          />
          <StepConfig
            inputLabel="Step 2"
            label={template.step2Label}
            icon={template.step2Icon || DEFAULTS.step2Icon}
            labelFieldName="step2Label"
            iconFieldName="step2Icon"
            control={control}
            register={register}
          />
          <StepConfig
            inputLabel="Step 3"
            label={template.step3Label}
            icon={template.step3Icon || DEFAULTS.step3Icon}
            labelFieldName="step3Label"
            iconFieldName="step3Icon"
            control={control}
            register={register}
          />
          <Button
            variant="contained"
            aria-label="save"
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}

function StepConfig(props: {
  inputLabel: string
  label: string
  labelFieldName: string
  icon: string
  iconFieldName: string
  control: Control
  register: FieldElement
}) {
  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid xs={6} item>
            <TextField
              label={props.inputLabel}
              fullWidth
              name={props.labelFieldName}
              defaultValue={props.label}
              inputProps={{
                'aria-label': props.inputLabel,
                ref: props.register,
              }}
            />
          </Grid>
          <Grid xs={6} item>
            <Controller
              name={props.iconFieldName}
              defaultValue={props.icon}
              control={props.control}
              render={({value, onChange}) => (
                <IconSelect value={value} onChange={onChange} />
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
