import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {Cards, useCards} from 'Event/template/Cards'
import ColorPicker from 'lib/ui/ColorPicker'
import Dialog from 'lib/ui/Dialog'
import React from 'react'

import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'

export default function PageLinksConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {
    template: {pageLinks},
    update,
  } = useCards()

  const {isVisible, onClose} = props

  const {handleSubmit, control} = useForm()

  const save = (data: Cards['pageLinks']) => {
    const updated = {
      ...pageLinks,
      ...data,
    }

    update.primitive('pageLinks')(updated)
    onClose()
  }

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <DialogTitle>Page Links</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(save)}>
          <Controller
            name="dividerColor"
            defaultValue={pageLinks.dividerColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Divider Color"
                color={value}
                onPick={onChange}
                aria-label="divider color"
              />
            )}
          />
          <Controller
            name="textColor"
            defaultValue={pageLinks.textColor}
            control={control}
            render={({value, onChange}) => (
              <ColorPicker
                label="Text Color"
                color={value}
                onPick={onChange}
                aria-label="text color"
              />
            )}
          />
          <SaveButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}
