import FormControlLabel from '@material-ui/core/FormControlLabel'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'event/Dashboard/editor/state/actions'
import {useEditMode} from 'event/Dashboard/editor/state/edit-mode'
import Typography from '@material-ui/core/Typography'

export default function ConfigBar() {
  const isEditMode = useEditMode()
  const dispatch = useDispatch()

  const toggle = () => dispatch(setEditMode(!isEditMode))

  return (
    <Box>
      <Typography>Configure Dashboard</Typography>
      <FormControlLabel
        control={
          <Switch checked={!isEditMode} onChange={toggle} color="primary" />
        }
        label="Preview"
      />
    </Box>
  )
}

const Box = styled.div`
  height: 50px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.theme.spacing[4]};
`
