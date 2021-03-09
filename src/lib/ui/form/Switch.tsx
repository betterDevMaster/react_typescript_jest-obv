import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel, {
  FormControlLabelProps,
} from '@material-ui/core/FormControlLabel'
import Switch, {SwitchProps} from '@material-ui/core/Switch'

type SwitchLabelsProps = {
  name?: string
  onChange: SwitchProps['onChange']
  label?: string | ''
  checked: SwitchProps['checked']
  labelPlacement: FormControlLabelProps['labelPlacement']
  color: SwitchProps['color']
  'aria-label'?: string
}

export default function SwitchLabel(props: SwitchLabelsProps) {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={props.checked}
            onChange={props.onChange}
            name={props.name}
            color={props.color}
            inputProps={{'aria-label': props['aria-label']}}
          />
        }
        label={props.label}
        labelPlacement={props.labelPlacement}
      />
    </FormGroup>
  )
}
