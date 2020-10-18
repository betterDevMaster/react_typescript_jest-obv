import {TextField} from '@material-ui/core'
import {useUpdateDashboard} from 'Dashboard/edit/state/edit-mode'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import {onChangeStringHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export default function FooterConfig() {
  const footer = useSelector((state: RootState) => state.dashboardEditor.footer)
  const updateDashboard = useUpdateDashboard()

  if (!footer) {
    throw new Error('Missing footer; was it set via edit?')
  }

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
