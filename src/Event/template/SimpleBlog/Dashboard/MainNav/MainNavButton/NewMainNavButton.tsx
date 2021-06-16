import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {setConfig} from 'Event/Dashboard/editor/state/actions'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import {MAIN_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import React from 'react'
import {useDispatch} from 'react-redux'
import {v4 as uid} from 'uuid'
import {useSimpleBlog} from 'Event/template/SimpleBlog'

export default function NewMainNavButton(props: {className?: string}) {
  const {template} = useSimpleBlog()
  const {mainNav: buttons} = template
  const updateTemplate = useDispatchUpdate()
  const dispatch = useDispatch()

  if (!buttons) {
    return null
  }

  const addButton = () => {
    const id = uid()
    const button: NavButtonWithSize = {
      text: 'Button',
      link: '',
      size: 12,
      rules: [],
      isAreaButton: false,
      areaId: null,
      actionId: null,
      isVisible: true,
      infusionsoftTag: null,
    }
    const entities = {
      ...buttons.entities,
      [id]: button,
    }
    const ids = [...buttons.ids, id]

    updateTemplate({
      mainNav: {
        entities,
        ids,
      },
    })

    // Show config after adding button
    dispatch(setConfig({type: MAIN_NAV_BUTTON, id}))
  }
  return (
    <Grid item xs={12} className={props.className}>
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
