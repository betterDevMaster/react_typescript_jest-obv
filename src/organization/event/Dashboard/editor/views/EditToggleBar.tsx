import FormControlLabel from '@material-ui/core/FormControlLabel'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'organization/event/Dashboard/editor/state/actions'
import {useEditMode} from 'organization/event/Dashboard/editor/state/edit-mode'

export default function EditToggleBar() {
  const isEditMode = useEditMode()
  const dispatch = useDispatch()

  const toggle = () => dispatch(setEditMode(!isEditMode))

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={isEditMode} onChange={toggle} color="primary" />
        }
        label="Edit Mode"
      />
    </Box>
  )
}

const Box = styled.div`
  height: 50px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
  justify-content: center;
`
