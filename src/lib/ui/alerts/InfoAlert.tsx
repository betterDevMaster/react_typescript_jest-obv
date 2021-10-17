import Alert, {AlertLevelProps} from 'lib/ui/alerts/Alert'
import React from 'react'

export default function InfoAlert(props: AlertLevelProps) {
  return <Alert {...props} severity="info" />
}
