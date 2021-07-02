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
import {useForm} from 'react-hook-form'

export function PointsSummaryConfig(props: ComponentConfigProps) {
  const {template} = useSimpleBlog()
  const {isVisible, onClose} = props

  const {points} = template
  const updateTemplate = useDispatchUpdate()
  const {event} = useEvent()

  const {register, handleSubmit} = useForm()

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
        <TextField
          defaultValue={points?.description || ''}
          name="description"
          label="Description"
          multiline
          rows={4}
          fullWidth
          inputProps={{
            'aria-label': 'points description',
            ref: register,
          }}
        />
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
