import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor, {TextEditorContainer} from 'lib/ui/form/TextEditor'
import {Controller, useForm} from 'react-hook-form'
import {SimpleBlog, useSimpleBlog} from 'Event/template/SimpleBlog'
import Button from '@material-ui/core/Button'
import {useUpdate} from 'Event/EventProvider'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import {onChangeStringHandler} from 'lib/dom'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

export type LeaderboardConfigData = NonNullable<SimpleBlog['leaderboard']>

export default function LeaderboardConfig(props: {onComplete?: () => void}) {
  const {template} = useSimpleBlog()
  const {leaderboard, rewardAlert} = template
  const {register, control, handleSubmit} = useForm()
  const [processing, setProcessing] = useState(false)
  const updateEvent = useUpdate()

  const [rewardText, setRewardText] = useState<string>(rewardAlert.text)
  const [rewardBackgroundColor, setRewardBackgroundColor] = useState<string>(
    rewardAlert.backgroundColor,
  )
  const [rewardTextColor, setRewardTextColor] = useState<string>(
    rewardAlert.textColor,
  )

  const submit = (
    data: LeaderboardConfigData & {points_unit: SimpleBlog['points_unit']},
  ) => {
    if (processing) {
      return
    }
    const {points_unit, ...leaderboardData} = data

    setProcessing(true)

    const existing = template.leaderboard || {}

    const updated = {
      ...template,
      rewardAlert: {
        text: rewardText,
        backgroundColor: rewardBackgroundColor,
        textColor: rewardTextColor,
      },
      points_unit,
      leaderboard: {
        ...existing,
        ...leaderboardData,
      },
    }

    updateEvent({template: updated}).finally(() => {
      setProcessing(false)
      props.onComplete && props.onComplete()
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Grid container spacing={2}>
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
            name="unit"
            defaultValue={template.points_unit}
            label="Unit"
            fullWidth
            inputProps={{
              'aria-label': 'points unit',
              ref: register,
            }}
          />
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
            disabled={processing}
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
                <TextEditor
                  data={value}
                  onChange={onChange}
                  disabled={processing}
                />
              </TextEditorContainer>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="backToDashboardText"
            defaultValue={leaderboard.backToDashboardText}
            label="Back to Dashboard Text"
            fullWidth
            inputProps={{
              'aria-label': 'set leaderboard page back to dashboard text',
              ref: register({required: 'Back to dashboard text is required'}),
            }}
            required
            disabled={processing}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="backToDashboardTextColor"
            control={control}
            defaultValue={leaderboard.backToDashboardTextColor}
            render={({value, onChange}) => (
              <ColorPicker
                label="Back to Dashboard Text Color"
                color={value}
                onPick={onChange}
                aria-label="set back to dashboard text color"
                disabled={processing}
              />
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
            disabled={processing}
          />
        </Grid>
      </Grid>
      <Button
        fullWidth
        color="primary"
        type="submit"
        disabled={processing}
        variant="contained"
        aria-label="save"
      >
        Save
      </Button>
    </form>
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
