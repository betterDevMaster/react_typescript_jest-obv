import Alert, {AlertLevelProps} from 'lib/ui/alerts/Alert'
import React from 'react'

export default function ErrorAlert(props: AlertLevelProps) {
  return <Alert {...props} severity="error" />
}
