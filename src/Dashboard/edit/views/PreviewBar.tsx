import FormControlLabel from '@material-ui/core/FormControlLabel'
import grey from '@material-ui/core/colors/grey'
import styled from 'styled-components'
import Switch from '@material-ui/core/Switch'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {setPreviewMode} from 'Dashboard/edit/state/actions'

export default function PreviewBar() {
  const isPreviewMode = usePreviewMode()
  const dispatch = useDispatch()

  const toggle = () => dispatch(setPreviewMode(!isPreviewMode))

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={isPreviewMode} onChange={toggle} color="primary" />
        }
        label="Preview"
      />
    </Box>
  )
}

export function usePreviewMode() {
  return useSelector((state: RootState) => state.dashboardEditor.isPreviewMode)
}

const Box = styled.div`
  height: 50px;
  border-bottom: 1px solid ${grey[300]};
  display: flex;
  align-items: center;
  justify-content: center;
`
