import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel, {
  FormControlLabelProps,
} from '@material-ui/core/FormControlLabel'
import Switch, {MuiSwitchProps} from '@material-ui/core/Switch'

type SwitchLabelsProps = {
  name?: string
  onChange: MuiSwitchProps['onChange']
  label?: string | ''
  checked: MuiSwitchProps['checked']
  labelPlacement: FormControlLabelProps['labelPlacement']
  color: MuiSwitchProps['color']
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
