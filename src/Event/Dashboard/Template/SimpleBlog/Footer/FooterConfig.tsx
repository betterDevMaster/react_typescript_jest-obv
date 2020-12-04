import {TextField} from '@material-ui/core'
import {SimpleBlog} from 'Event/Dashboard/Template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {
  useDashboard,
  useUpdateDashboard,
} from 'Event/Dashboard/state/DashboardProvider'
import {FOOTER} from 'Event/Dashboard/Template/SimpleBlog/Footer'

export type FooterConfig = {
  type: typeof FOOTER
}

export function FooterConfig() {
  const {footer} = useDashboard()
  const updateDashboard = useUpdateDashboard()

  const update = <T extends keyof SimpleBlog['footer']>(key: T) => (
    value: SimpleBlog['footer'][T],
  ) =>
    updateDashboard({
      footer: {
        ...footer,
        [key]: value,
      },
    })

  return (
    <>
      <ColorPicker
        label="Background Color"
        color={footer.background}
        onPick={update('background')}
      />
      <ColorPicker
        label="Text Color"
        color={footer.textColor}
        onPick={update('textColor')}
      />
      <TextField
        label="Terms Link"
        value={footer.termsLink || ''}
        inputProps={{
          'aria-label': 'set footer terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(update('termsLink'))}
      />
      <TextField
        label="Privacy Link"
        value={footer.privacyLink || ''}
        inputProps={{
          'aria-label': 'set privacy terms link',
        }}
        fullWidth
        onChange={onChangeStringHandler(update('privacyLink'))}
      />
      <TextField
        label="Copyright Text"
        value={footer.copyrightText || ''}
        inputProps={{
          'aria-label': 'set copyright text',
        }}
        fullWidth
        onChange={onChangeStringHandler(update('copyrightText'))}
      />
    </>
  )
}
