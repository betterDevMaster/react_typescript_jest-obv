import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React from 'react'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import grey from '@material-ui/core/colors/grey'
import SaveButton from 'Event/Dashboard/editor/views/ConfigBar/SaveButton'

export default function ConfigBar() {
  const isEditMode = useEditMode()
  const dispatch = useDispatch()

  const toggle = () => dispatch(setEditMode(!isEditMode))

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={!isEditMode} onChange={toggle} color="primary" />
        }
        label="Preview"
      />
      <SaveButton />
    </Box>
  )
}

const Box = styled.div`
  height: 50px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 ${(props) => props.theme.spacing[4]};
`
