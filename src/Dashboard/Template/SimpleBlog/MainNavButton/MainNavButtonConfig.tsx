import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {NavButtonWithSize} from 'Dashboard/components/NavButton'
import {setDashboard} from 'Dashboard/edit/state/actions'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'store'

export function MainNavButtonConfig(props: {id?: string}) {
  const buttons = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )

  const dispatch = useDispatch()
  const {id} = props

  if (!id) {
    throw new Error('Missing component id')
  }

  if (!buttons) {
    throw new Error('Missing nav buttons')
  }
  const button = buttons.entities[id]

  const update = (updated: NavButtonWithSize) => {
    dispatch(
      setDashboard({
        mainNavButtons: {
          ...buttons,
          entities: {
            ...buttons.entities,
            [id]: updated,
          },
        },
      }),
    )
  }

  const updateButton = <T extends keyof NavButtonWithSize>(key: T) => (
    value: NavButtonWithSize[T],
  ) =>
    update({
      ...button,
      [key]: value,
    })

  return (
    <>
      <TextField
        label="Text"
        value={button.text}
        inputProps={{
          'aria-label': 'button name input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('text'))}
      />
      <Typography gutterBottom>Size</Typography>
      <Slider
        min={1}
        max={12}
        onChange={handleChangeSlider(updateButton('size'))}
        valueLabelDisplay="auto"
        value={button.size || 0}
      />
      <TextField
        label="Link URL"
        value={button.link}
        inputProps={{
          'aria-label': 'button link input',
        }}
        fullWidth
        onChange={onChangeStringHandler(updateButton('link'))}
      />
      <FormControl>
        <FormControlLabel
          label="New Tab"
          control={
            <Checkbox
              checked={button.newTab}
              onChange={onChangeCheckedHandler(updateButton('newTab'))}
            />
          }
        />
      </FormControl>
      <ColorPicker
        label="Background Color"
        color={button.backgroundColor}
        onPick={updateButton('backgroundColor')}
      />
      <ColorPicker
        label="Hover Background Color"
        color={button.hoverBackgroundColor}
        onPick={updateButton('hoverBackgroundColor')}
      />
      <ColorPicker
        label="Text Color"
        color={button.textColor}
        onPick={updateButton('textColor')}
      />
      <ColorPicker
        label="Border Color"
        color={button.borderColor}
        onPick={updateButton('borderColor')}
      />
      <ColorPicker
        label="Hover Border Color"
        color={button.hoverBorderColor}
        onPick={updateButton('hoverBorderColor')}
      />
      <TextField
        value={button.borderWidth || 0}
        label="Border"
        type="number"
        onChange={onChangeNumberHandler(updateButton('borderWidth'))}
      />
      <Typography gutterBottom>Border Radius</Typography>
      <Slider
        min={0}
        max={20}
        onChange={handleChangeSlider(updateButton('borderRadius'))}
        valueLabelDisplay="auto"
        value={button.borderRadius || 0}
      />
    </>
  )
}
