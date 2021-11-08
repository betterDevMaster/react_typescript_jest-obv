import {Attendee} from 'Event/attendee'
import React, {useEffect, useRef, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import {fieldError} from 'lib/form'
import {useForm, Controller} from 'react-hook-form'
import {ValidationError} from 'lib/api-client'
import {useAttendees} from 'organization/Event/AttendeesProvider'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import TagsInput, {Tag} from 'lib/ui/form/TagsInput'
import GroupInput from 'organization/Event/AttendeeManagement/attendee-dialog/Form/GroupInput'
import {
  UPDATE_ATTENDEES,
  usePermissions,
} from 'organization/PermissionsProvider'
import HasPermission from 'organization/HasPermission'
import NewGroupInput from 'organization/Event/AttendeeManagement/attendee-dialog/Form/NewGroupInput'

export interface NewGroup {
  key: string
  value: string
}

export default function Form(props: {
  submit: (data: Partial<Attendee>) => Promise<void>
  onClose: () => void
  isVisible: boolean
  attendee?: Attendee
}) {
  const {register, handleSubmit, errors, control} = useForm()
  const [serverError, setServerError] = useState<
    ValidationError<Partial<Attendee>>
  >(null)
  const {isVisible, attendee} = props
  const [submitting, setSubmitting] = useState(false)
  const [newGroups, setNewGroups] = useState<NewGroup[]>([])
  const {groups} = useAttendees()
  const isMounted = useRef(true)
  const [tags, setTags] = useState<Tag[]>(attendee?.tags || [])

  const {can} = usePermissions()
  const canEdit = can(UPDATE_ATTENDEES)

  useEffect(() => {
    setNewGroups([])
  }, [isVisible])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

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
    if (submitting) {
      return
    }

    setServerError(null)
    setSubmitting(true)

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

    props
      .submit({...data, tags, groups})
      .then(props.onClose)
      .catch(setServerError)
      .finally(() => {
        if (isMounted.current) {
          setSubmitting(false)
        }
      })
  }

  const firstNameError = fieldError('first_name', {
    form: errors,
    response: serverError,
  })

  const lastNameError = fieldError('last_name', {
    form: errors,
    response: serverError,
  })

  const emailError = fieldError('email', {
    form: errors,
    response: serverError,
  })

  // If 'is_active' is undefined, ie. we're creating a new user, we want to set
  // it to TRUE by default. So we need to explicitly check it here.
  const isActive = attendee?.is_active === undefined ? true : attendee.is_active

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormControl fullWidth disabled={submitting}>
        <FormControlLabel
          control={
            <Controller
              type="checkbox"
              name="is_active"
              defaultValue={isActive}
              control={control}
              render={({onChange, value}) => (
                <Switch
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  inputProps={{'aria-label': 'toggle active'}}
                />
              )}
            />
          }
          label="Active"
        />
      </FormControl>
      <TextField
        label="First Name"
        fullWidth
        variant="outlined"
        name="first_name"
        defaultValue={attendee?.first_name || ''}
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
        defaultValue={attendee?.last_name || ''}
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
        defaultValue={attendee?.email || ''}
        inputProps={{
          ref: register({
            required: 'Email is required',
          }),
          'aria-label': 'email input',
        }}
        error={Boolean(emailError)}
        helperText={emailError}
        disabled={!canEdit}
      />
      <TagsInput
        value={tags}
        onChange={setTags}
        name="tags"
        aria-label="tags"
        label="Tags"
        disabled={!canEdit}
      />
      {groups.map((group) => (
        <GroupInput
          key={group}
          group={group}
          attendee={attendee}
          ref={register}
          disabled={!canEdit}
        />
      ))}
      {newGroups.map((group, index) => (
        <NewGroupInput
          key={index}
          group={group}
          onChange={updateNewGroup(index)}
        />
      ))}
      <HasPermission permission={UPDATE_ATTENDEES}>
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
      </HasPermission>
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
  )
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
