import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {setComponent} from 'Dashboard/edit/state/actions'
import {ComponentConfig} from 'Dashboard/edit/views/DashboardEditDialog/ComponentConfig'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export default function DashboardEditDialog() {
  const component = useSelector(
    (state: RootState) => state.dashboardEditor.component,
  )

  const dispatch = useDispatch()

  const dialogVisible = Boolean(component)

  const stopEdit = () => {
    dispatch(setComponent(null))
  }

  return (
    <Dialog open={dialogVisible} onClose={stopEdit}>
      <DialogTitle>Configure</DialogTitle>
      <DialogContent>
        <ComponentConfig component={component} />
      </DialogContent>
    </Dialog>
  )
}
