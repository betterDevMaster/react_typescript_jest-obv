import {Attendee} from 'Event/attendee'
import React, {useEffect, useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from 'lib/ui/Dialog'
import TextField from '@material-ui/core/TextField'
import {fieldError} from 'lib/form'
import {useForm} from 'react-hook-form'
import {ValidationError} from 'lib/api-client'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import Button from '@material-ui/core/Button'
import {api} from 'lib/url'
import {spacing} from 'lib/ui/theme'
import {withStyles} from '@material-ui/core'
import TagsInput from 'lib/ui/form/TagsInput'
import GroupInput from 'organization/Event/AttendeeManagement/EditDialog/GroupInput'
import NewGroupInput from 'organization/Event/AttendeeManagement/EditDialog/NewGroupInput'

export interface NewGroup {
  key: string
  value: string
}

export default function EditDialog(props: {
  attendee: Attendee | null
  onClose: () => void
}) {
  const {attendee} = props
  const {register, handleSubmit, errors} = useForm()
  const [serverError, setServerError] = useState<
    ValidationError<Partial<Attendee>>
  >(null)
  const [submitting, setSubmitting] = useState(false)
  const update = useUpdate()
  const {groups} = useAttendees()
  const isVisible = Boolean(props.attendee)
  const [newGroups, setNewGroups] = useState<NewGroup[]>([])

  useEffect(() => {
    setNewGroups([])
  }, [isVisible])

  const addGroup = () => {
    const added = [...newGroups, {key: '', value: ''}]
    setNewGroups(added)
  }

  const updateNewGroup = (targetIndex: number) => (updated: NewGroup) => {
    const updatedList = newGroups.map((g, i) => {
      const isTarget = i === targetIndex
      if (isTarget) {
        return updated
      }

      return g
    })

    setNewGroups(updatedList)
  }

  const submit = (data: Partial<Attendee>) => {
    if (submitting || !attendee) {
      return
    }

    setServerError(null)
    setSubmitting(true)

    /**
     * If no tags were included, react-hook-from won't send an
     * empty array so we need to include it ourself to
     * handle the case of clearing all tags.
     */
    const tags = data.tags || []

    /**
     * Dynamically append new groups
     */
    const groups = newGroups.reduce((acc, i) => {
      if (!i.key || !i.value) {
        return acc
      }
      acc[i.key] = i.value
      return acc
    }, data.groups || {})

    update(attendee, {...data, tags, groups})
      .then(props.onClose)
      .catch(setServerError)
      .finally(() => {
        setSubmitting(false)
      })
  }

  if (!attendee) {
    return null
  }

  const firstNameError = fieldError('first_name', {
    form: errors,
    server: serverError,
  })

  const lastNameError = fieldError('last_name', {
    form: errors,
    server: serverError,
  })

  const emailError = fieldError('email', {
    form: errors,
    server: serverError,
  })

  return (
    <Dialog open={isVisible} onClose={props.onClose}>
      <DialogTitle>Edit Attendee</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            label="First Name"
            fullWidth
            variant="outlined"
            name="first_name"
            defaultValue={attendee.first_name}
            inputProps={{
              ref: register({
                required: 'First name is required',
              }),
              'aria-label': 'first name',
            }}
            error={Boolean(firstNameError)}
            helperText={firstNameError}
          />
          <TextField
            label="Last Name"
            fullWidth
            variant="outlined"
            name="last_name"
            defaultValue={attendee.last_name}
            inputProps={{
              ref: register({
                required: 'Last name is required',
              }),
              'aria-label': 'last name',
            }}
            error={Boolean(lastNameError)}
            helperText={lastNameError}
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            name="email"
            defaultValue={attendee.email}
            inputProps={{
              ref: register({
                required: 'Email is required',
              }),
              'aria-label': 'email',
            }}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <TagsInput
            value={attendee.tags}
            name="tags"
            aria-label="tags"
            ref={register}
            label="Tags"
          />
          {groups.map((group) => (
            <GroupInput
              key={group}
              group={group}
              attendee={attendee}
              ref={register}
            />
          ))}
          {newGroups.map((group, index) => (
            <NewGroupInput
              key={index}
              group={group}
              onChange={updateNewGroup(index)}
            />
          ))}
          <AddGroupButton
            aria-label="add group"
            variant="outlined"
            color="primary"
            onClick={addGroup}
            fullWidth
            size="large"
          >
            Add Group
          </AddGroupButton>
          <SaveButton
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            size="large"
            disabled={submitting}
            aria-label="save"
          >
            Save
          </SaveButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function useUpdate() {
  const list = useAttendees()
  const {event} = useEvent()
  const {client} = useOrganization()

  return (attendee: Attendee, data: Partial<Attendee>) => {
    const url = api(`/events/${event.slug}/attendees/${attendee.id}`)
    return client.patch<Attendee>(url, data).then(list.update)
  }
}

const SaveButton = withStyles({
  root: {
    marginBottom: spacing[5],
  },
})(Button)

const AddGroupButton = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Button)
