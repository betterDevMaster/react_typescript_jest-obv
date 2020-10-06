import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Dashboard/components/NavButton'
import {setDashboard} from 'Dashboard/edit/state/actions'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'
import {v4 as uid} from 'uuid'

export default function NewMainNavButton(props: {isEditMode: boolean}) {
  const dispatch = useDispatch()
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )

  if (!props.isEditMode || !buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    dispatch(
      setDashboard({
        mainNavButtons: {
          entities,
          ids,
        },
      }),
    )
  }
  return (
    <Grid item xs={12}>
      <Button
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="add main nav button"
        onClick={addButton}
      >
        New Button
      </Button>
    </Grid>
  )
}
