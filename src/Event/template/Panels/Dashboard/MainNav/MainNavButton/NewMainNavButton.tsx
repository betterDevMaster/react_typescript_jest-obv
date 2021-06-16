import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {NavButtonWithSize} from 'Event/Dashboard/components/NavButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import React from 'react'
import {v4 as uid} from 'uuid'
import {usePanels} from 'Event/template/Panels'

export default function NewMainNavButton(props: {
  className?: string
  edit: (index: number) => void
}) {
  const {template} = usePanels()
  const {nav: buttons} = template
  const updateTemplate = useDispatchUpdate()

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
      nav: {
        entities,
        ids,
      },
    })
    const lastItemIndex = ids.length - 1

    props.edit(lastItemIndex)
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
