import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {onUnknownChangeHandler} from 'lib/dom'
import TextField from '@material-ui/core/TextField'
import {Grid} from '@material-ui/core'
import {Controller} from 'react-hook-form'
import {AttachmentConfigProps} from 'Event/Dashboard/components/BlogPosts/BlogPostConfig/AttachmentConfig'

export const DEFAULT_BUTTONS_POSITION = 'center'
export const DEFAULT_BUTTONS_WIDTH = 100

export default function ButtonsListConfig(props: AttachmentConfigProps) {
  const {control, register, post} = props

  return (
    <Grid container spacing={3}>
      <Grid item md={6} xs={6}>
        <InputLabel>Buttons Width %</InputLabel>
        <TextField
          defaultValue={post.buttonsWidth}
          name="buttonsWidth"
          type="number"
          fullWidth
          inputProps={{
            min: 1,
            max: 100,
            ref: register,
          }}
        />
      </Grid>
      <Grid item md={6} xs={6}>
        <InputLabel>Buttons Position</InputLabel>
        <Controller
          name="buttonsPosition"
          defaultValue={post.buttonsPosition}
          control={control}
          render={({value, onChange}) => (
            <Select
              value={value}
              onChange={onUnknownChangeHandler(onChange)}
              fullWidth
            >
              <MenuItem value="flex-end">Right</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="flex-start">Left</MenuItem>
            </Select>
          )}
        />
      </Grid>
    </Grid>
  )
}
