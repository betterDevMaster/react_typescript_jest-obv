import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import styled from 'styled-components'

import {
  FormControl,
  Grid,
  SnackbarContent,
  TextField,
  Typography,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

import Switch from 'lib/ui/form/Switch'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {onChangeStringHandler, onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'

import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function LeaderboardConfig(props: ComponentConfigProps) {
  const template = useNiftyFiftyTemplate()
  const {leaderboard, rewardAlert} = template
  const {register, control, handleSubmit} = useForm()

  const [rewardText, setRewardText] = useState<string>(rewardAlert.text)
  const [rewardBackgroundColor, setRewardBackgroundColor] = useState<string>(
    rewardAlert.backgroundColor,
  )
  const [rewardTextColor, setRewardTextColor] = useState<string>(
    rewardAlert.textColor,
  )

  const updateTemplate = useNiftyFiftyUpdate()

  const submit = (data: {
    title: string
    description: string
    points_unit: string
    menuTitle: string
    isVisible: boolean
  }) => {
    const {points_unit, ...leaderboardData} = data

    const updated = {
      rewardAlert: {
        text: rewardText,
        backgroundColor: rewardBackgroundColor,
        textColor: rewardTextColor,
      },
      points_unit,
      leaderboard: leaderboardData,
    }

    updateTemplate({
      leaderboard: leaderboardData,
      points_unit: points_unit,
    })

    props.onClose()
  }

  return (
    <ComponentConfig
      isVisible={props.isVisible}
      onClose={props.onClose}
      title="Leaderboard"
    >
      <form onSubmit={handleSubmit(submit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl>
              <Controller
                name="isVisible"
                control={control}
                defaultValue={leaderboard.isVisible}
                render={({value, onChange}) => (
                  <Switch
                    checked={value}
                    onChange={onChangeCheckedHandler(onChange)}
                    arial-label="toggle points"
                    labelPlacement="end"
                    color="primary"
                    label="Enabled"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Alert severity="info">
              <AlertTitle>Variables</AlertTitle>
              <div>
                <Typography variant="caption">
                  {`{{points_unit}} - Name for points`}
                </Typography>
              </div>
              <div>
                <Typography variant="caption">
                  {`{{action_description}} - Action description`}
                </Typography>
              </div>
              <div>
                <Typography variant="caption">
                  {`{{action_points}} - Number of points received`}
                </Typography>
              </div>
              <div>
                <Typography variant="caption">
                  {`{{leaderboard_points}} - Attendee's current points`}
                </Typography>
              </div>
              <div>
                <Typography variant="caption">
                  {`{{leaderboard_position}} - Attendee's current position on leaderboard`}
                </Typography>
              </div>
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <TextField
              defaultValue={leaderboard.title}
              name="title"
              label="Title"
              fullWidth
              inputProps={{
                'aria-label': 'set leaderboard page title',
                ref: register({required: 'Title is required'}),
              }}
            />
            <TextField
              defaultValue={leaderboard.menuTitle}
              name="menuTitle"
              label="Menu Title"
              fullWidth
              inputProps={{
                'aria-label': 'set leaderboard page menu title',
                ref: register({required: 'Title is required'}),
              }}
            />
            <TextField
              defaultValue={template.points_unit}
              name="points_unit"
              label="Points Unit"
              fullWidth
              inputProps={{
                ref: register({required: 'Points unit is required'}),
                'aria-label': 'points unit',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              defaultValue={leaderboard.description}
              rules={{
                required: 'Description is required',
              }}
              render={({value, onChange}) => (
                <TextEditorContainer>
                  <TextEditor data={value} onChange={onChange} />
                </TextEditorContainer>
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <StyledSnackerBar
              message={
                <Continer>
                  <CheckCircleIcon />
                  <StyledDiv>{rewardText}</StyledDiv>
                </Continer>
              }
              color={rewardTextColor}
              backgroundColor={rewardBackgroundColor}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ColorPicker
              label="Popup Background Color"
              color={rewardBackgroundColor}
              onPick={setRewardBackgroundColor}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ColorPicker
              label="Popup Color"
              color={rewardTextColor}
              onPick={setRewardTextColor}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              defaultValue={rewardText}
              name="popupText"
              label="Popup Text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              onChange={onChangeStringHandler(setRewardText)}
              inputProps={{
                'aria-label': 'set leaderboard popup text',
                ref: register({required: 'Title is required'}),
              }}
            />
          </Grid>
        </Grid>
        <SaveButton>Save</SaveButton>
      </form>
    </ComponentConfig>
  )
}

const StyledSnackerBar = styled(
  ({
    color,
    backgroundColor,
    ...otherProps
  }: {
    color: string
    backgroundColor: string
    message: React.ReactElement
  }) => <SnackbarContent {...otherProps} />,
)`
  color: ${(props) => props.color}!important;
  background-color: ${(props) => props.backgroundColor} !important;
`
const Continer = styled.div`
  display: flex;
`
const StyledDiv = styled.div`
  font-size: 19px;
`
