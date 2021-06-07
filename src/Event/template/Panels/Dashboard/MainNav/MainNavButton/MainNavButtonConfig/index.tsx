import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import NavButton, {
  DEFAULT_BUTTON_HEIGHT,
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {
  handleChangeSlider,
  onChangeCheckedHandler,
  onChangeNumberHandler,
  onChangeStringHandler,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import ColorPicker from 'lib/ui/ColorPicker'
import React from 'react'
import Box from '@material-ui/core/Box'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import Switch from 'lib/ui/form/Switch'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import IconSelect from 'lib/fontawesome/IconSelect'
import {usePanels} from 'Event/template/Panels'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

export type ButtonConfigProps<K extends NavButton> = {
  button: K
  update: <T extends keyof K>(key: T) => (value: K[T]) => void
}

export default function MainNavButtonConfig(props: {
  editing: number | null
  onClose: () => void
}) {
  const {template} = usePanels()
  const {nav: buttons} = template
  const updateTemplate = useDispatchUpdate()

  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const {editing} = props

  if (editing === null) {
    return null
  }

  const id = buttons.ids[editing]

  if (!buttons) {
    throw new Error('Missing nav buttons')
  }

  const button = buttons.entities[id]

  const update = (updated: NavButtonWithSize) => {
    updateTemplate({
      nav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const removeButton = () => {
    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    props.onClose()
    updateTemplate({
      nav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const updateButton =
    <T extends keyof NavButtonWithSize>(key: T) =>
    (value: NavButtonWithSize[T]) =>
      update({
        ...button,
        [key]: value,
      })

  return (
    <Dialog onClose={props.onClose} open={true}>
      <DialogTitle>Resource</DialogTitle>
      <DialogContent>
        <RuleConfig
          visible={ruleConfigVisible}
          close={toggleRuleConfig}
          rules={button.rules}
          onChange={updateButton('rules')}
        >
          <>
            <ConfigureRulesButton onClick={toggleRuleConfig} />
            <Box mb={2}>
              <Switch
                checked={button.isVisible}
                onChange={onChangeCheckedHandler(updateButton('isVisible'))}
                arial-label="config switch to attendee"
                labelPlacement="end"
                color="primary"
                label={button.isVisible ? 'Enable' : 'Disable'}
              />
            </Box>
            <IconSelect value={button.icon} onChange={updateButton('icon')} />
            <TextField
              label="Text"
              value={button.text}
              inputProps={{
                'aria-label': 'button name input',
              }}
              fullWidth
              onChange={onChangeStringHandler(updateButton('text'))}
            />

            <ActionSelect
              value={button.actionId}
              onChange={updateButton('actionId')}
            />

            <Typography gutterBottom>Size</Typography>
            <Slider
              min={1}
              max={12}
              onChange={handleChangeSlider(updateButton('size'))}
              valueLabelDisplay="auto"
              value={button.size || 0}
            />
            <Typography gutterBottom>Height</Typography>
            <Slider
              min={1}
              max={400}
              onChange={handleChangeSlider(updateButton('height'))}
              valueLabelDisplay="auto"
              value={button.height || DEFAULT_BUTTON_HEIGHT}
            />
            <TargetConfig
              update={updateButton}
              button={button}
              disablePageSelect
            />
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
              value={button.borderWidth || ''}
              label="Border Width"
              type="number"
              fullWidth
              inputProps={{
                min: 0,
              }}
              onChange={onChangeNumberHandler(updateButton('borderWidth'))}
            />
            <TextField
              value={button.borderRadius || ''}
              label="Border Radius"
              type="number"
              fullWidth
              inputProps={{
                min: 0,
              }}
              onChange={onChangeNumberHandler(updateButton('borderRadius'))}
            />
            <InfusionsoftTagInput
              value={button.infusionsoftTag}
              onChange={updateButton('infusionsoftTag')}
            />
            <Box mt={2} mb={3}>
              <DangerButton
                fullWidth
                variant="outlined"
                aria-label="remove button"
                onClick={removeButton}
              >
                REMOVE BUTTON
              </DangerButton>
            </Box>
          </>
        </RuleConfig>
      </DialogContent>
    </Dialog>
  )
}
