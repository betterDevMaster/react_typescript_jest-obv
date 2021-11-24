import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import {Cards, useCardsTemplate, useCardsUpdate} from 'Event/template/Cards'
import IconSelect from 'lib/fontawesome/IconSelect'
import ColorPicker from 'lib/ui/ColorPicker'
import Page, {SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Controller, useForm, UseFormMethods} from 'react-hook-form'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
export type Step = 1 | 2 | 3

export default function CheckInConfig() {
  const {checkIn} = useCardsTemplate()
  const {handleSubmit, control, register} = useForm()
  const update = useCardsUpdate()

  const save = (data: Cards['checkIn']) => {
    update({
      checkIn: data,
    })
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Check In</SectionTitle>
        <form onSubmit={handleSubmit(save)}>
          <Box mb={2}>
            <TextField
              label="Title"
              name="title"
              defaultValue={checkIn.title}
              inputProps={{
                'aria-label': 'check in title',
                ref: register,
              }}
              fullWidth
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="stepLabelColor"
                defaultValue={checkIn.stepLabelColor}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="inActiveColor"
                defaultValue={checkIn.inActiveColor}
                control={control}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Step Inactive Color"
                    color={value}
                    onPick={onChange}
                    aria-label="step inactive color"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <StepConfig
              inputLabel="Step 1"
              label={checkIn.step1Label}
              icon={checkIn.step1Icon}
              register={register}
              control={control}
              labelName="step1Label"
              iconName="step1Icon"
            />
            <StepConfig
              inputLabel="Step 2"
              label={checkIn.step2Label}
              icon={checkIn.step2Icon}
              register={register}
              control={control}
              labelName="step2Label"
              iconName="step2Icon"
            />
            <StepConfig
              inputLabel="Step 3"
              label={checkIn.step3Label}
              icon={checkIn.step3Icon}
              register={register}
              control={control}
              labelName="step3Label"
              iconName="step3Icon"
            />
          </Grid>
          <SaveButton />
        </form>
      </Page>
    </Layout>
  )
}

function StepConfig(props: {
  inputLabel: string
  label: string
  icon: string
  register: UseFormMethods['register']
  control: UseFormMethods['control']
  labelName: string
  iconName: string
}) {
  return (
    <>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid xs={12} md={12} item>
            <TextField
              name={props.labelName}
              label={props.inputLabel}
              defaultValue={props.label}
              inputProps={{
                'aria-label': props.inputLabel,
                ref: props.register,
              }}
              fullWidth
            />
          </Grid>
          <Grid xs={12} md={12} item>
            <Controller
              name={props.iconName}
              defaultValue={props.icon}
              control={props.control}
              render={({value, onChange}) => (
                <IconSelect value={value} onChange={onChange} />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
