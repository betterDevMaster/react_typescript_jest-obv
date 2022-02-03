import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useEditMode, useIsSaving} from 'Event/Dashboard/editor/state/edit-mode'
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress'
import grey from '@material-ui/core/colors/grey'
import green from '@material-ui/core/colors/green'
import yellow from '@material-ui/core/colors/yellow'

export default function ConfigBar() {
  const isEditMode = useEditMode()

  const setIsEditMode = useSetIsEditMode()

  const toggle = () => setIsEditMode(!isEditMode)

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={!isEditMode} onChange={toggle} color="primary" />
        }
        label="Preview"
      />
      <SavingIndicator />
    </Box>
  )
}

export function useSetIsEditMode() {
  const dispatch = useDispatch()

  return useCallback(
    (mode: boolean) => {
      dispatch(setEditMode(mode))
    },
    [dispatch],
  )
}

function SavingIndicator() {
  const isSaving = useIsSaving()
  const variant: CircularProgressProps['variant'] = isSaving
    ? 'indeterminate'
    : 'determinate'
  return (
    <ProgressSpinner
      size={18}
      thickness={6}
      value={100}
      variant={variant}
      active={isSaving}
    />
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

const ProgressSpinner = styled((props) => {
  const {active: _, ...otherProps} = props
  return <CircularProgress {...otherProps} />
})<{active: boolean}>`
  color: ${(props) => (props.active ? yellow[700] : green[400])} !important;
`
