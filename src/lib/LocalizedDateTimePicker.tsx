import React from 'react'
import {DateTimePicker, DateTimePickerProps} from '@material-ui/pickers'
import {useLocalization} from 'lib/LocalizationProvider'

export default function LocalizedDateTimePicker(props: DateTimePickerProps) {
  const {has12HourTime} = useLocalization()
  return <DateTimePicker {...props} ampm={has12HourTime} />
}
