import TextField from '@material-ui/core/TextField'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import React from 'react'
import styled from 'styled-components'
import EventImageUpload from 'organization/Event/DashboardConfig/EventImageUpload'
import {useEvent} from 'Event/EventProvider'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import TextEditor from 'lib/ui/form/TextEditor'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import {withDefault} from 'lib/template'
import {DEFAULT_POINTS_SUMMARY} from 'Event/template/SimpleBlog/Dashboard/PointsSummary'

const DEFAULT_POINTS_DESCRIPTION =
  '<p> If you would like to see where you stand on the <a href="/leaderboard"><strong>LEADERBOARD you can click HERE!</strong></a></p>'

export function PointsSummaryConfig(props: ComponentConfigProps) {
  const {template} = useSimpleBlog()
  const {isVisible, onClose} = props
  const {points} = template
  const updateTemplate = useDispatchUpdate()
  const {event} = useEvent()
  const {register, handleSubmit, control} = useForm()

  const save = (data: any) => {
    updateTemplate({
      points: data,
    })

    onClose()
  }

  const removePoints = () => {
    onClose()
    updateTemplate({points: null})
  }

  return (
    <ComponentConfig title="Points" isVisible={isVisible} onClose={onClose}>
      <form onSubmit={handleSubmit(save)}>
        <EventImageUpload
          label="Points Logo"
          property="points_summary_logo"
          current={event.points_summary_logo}
        />
        <Box mb={2}>
          <Alert severity="info">
            <AlertTitle>Variables</AlertTitle>
            <div>
              <Typography variant="caption">
                {`{{leaderboard_points}} - Attendee's current points`}
              </Typography>
            </div>
            <Typography variant="caption">
              {`{{points_unit}} - Name for points`}
            </Typography>
          </Alert>
        </Box>
        <Box mb={2}>
          <Box mb={1}>
            <InputLabel>Summary</InputLabel>
          </Box>
          <Controller
            name="summary"
            control={control}
            defaultValue={withDefault(DEFAULT_POINTS_SUMMARY, points?.summary)}
            render={({value, onChange}) => (
              <TextEditor
                data={value}
                onChange={onChange}
                customToolBars={['bold', 'italic', 'link', 'alignment']}
                customLinks={['leaderboardLink']}
              />
            )}
          />
        </Box>
        <Box mb={1}>
          <Box mb={1}>
            <InputLabel>Description</InputLabel>
          </Box>
          <Controller
            name="description"
            control={control}
            defaultValue={withDefault(
              DEFAULT_POINTS_DESCRIPTION,
              points?.description,
            )}
            render={({value, onChange}) => (
              <TextEditor
                data={value}
                onChange={onChange}
                customToolBars={['bold', 'italic', 'link', 'alignment']}
                customLinks={['leaderboardLink']}
              />
            )}
          />
        </Box>
        <TextField
          name="unit"
          defaultValue={points?.unit || ''}
          label="Unit"
          fullWidth
          inputProps={{
            'aria-label': 'points unit',
            ref: register,
          }}
        />
        <SaveButton type="submit" />
        <RemovePointsButton
          fullWidth
          variant="outlined"
          aria-label="remove points"
          onClick={removePoints}
        >
          REMOVE POINTS
        </RemovePointsButton>
      </form>
    </ComponentConfig>
  )
}

const RemovePointsButton = styled(DangerButton)`
  margin-top: ${(props) => props.theme.spacing[2]} !important;
  margin-bottom: ${(props) => props.theme.spacing[3]} !important;
`
