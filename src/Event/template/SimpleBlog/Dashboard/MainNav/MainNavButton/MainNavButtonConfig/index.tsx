import Slider from '@material-ui/core/Slider'
import {v4 as uuid} from 'uuid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import NavButton, {
  NavButtonWithSize,
  DEFAULT_BUTTON_HEIGHT,
} from 'Event/Dashboard/components/NavButton'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import Switch from 'lib/ui/form/Switch'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import IconSelect from 'lib/fontawesome/IconSelect'
import {useSimpleBlog} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'

export type ButtonConfigProps<K extends NavButton> = {
  button: K
  update: <T extends keyof K>(key: T) => (value: K[T]) => void
  disablePageSelect?: boolean
}

export function MainNavButtonConfig(
  props: ComponentConfigProps & {
    button: NavButtonWithSize
    id?: string
  },
) {
  const {isVisible, onClose, id, button} = props
  const {template} = useSimpleBlog()
  const {mainNav: buttons} = template

  const {register, control, handleSubmit} = useForm()

  const [rules, setRules] = useState(button.rules)
  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [areaId, setAreaId] = useState(button.areaId)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)

  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(button.rules)
    setIsAreaButton(button.isAreaButton)
    setAreaId(button.areaId)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
  }, [isVisible, button])

  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const updateTemplate = useDispatchUpdate()

  const update = (id: string, updated: NavButtonWithSize) => {
    updateTemplate({
      mainNav: {
        ...buttons,
        entities: {
          ...buttons.entities,
          [id]: updated,
        },
      },
    })
  }

  const insert = (button: NavButtonWithSize) => {
    const id = uuid()

    updateTemplate({
      mainNav: {
        ids: [...buttons.ids, id],
        entities: {
          ...buttons.entities,
          [id]: button,
        },
      },
    })
  }

  const removeButton = () => {
    if (!id) {
      throw new Error('Missing button id')
    }

    const {[id]: target, ...otherButtons} = buttons.entities
    const updatedIds = buttons.ids.filter((i) => i !== id)

    updateTemplate({
      mainNav: {
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const save = (formData: any) => {
    const data: NavButtonWithSize = {
      ...formData,
      rules,
      isAreaButton,
      areaId,
      link,
      page,
      newTab,
    }

    if (id) {
      update(id, data)
      onClose()
      return
    }

    insert(data)
    onClose()
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Main Nav Button"
    >
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <form onSubmit={handleSubmit(save)}>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <Box mb={2}>
            <Controller
              name="isVisible"
              control={control}
              defaultValue={button.isVisible}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  arial-label="config switch to attendee"
                  labelPlacement="end"
                  color="primary"
                  label={button.isVisible ? 'Enable' : 'Disable'}
                />
              )}
            />
          </Box>
          <Controller
            name="icon"
            defaultValue={button.icon || ''}
            control={control}
            render={({value, onChange}) => (
              <IconSelect value={value} onChange={onChange} />
            )}
          />
          <TextField
            label="Text"
            name="text"
            defaultValue={button.text}
            inputProps={{
              'aria-label': 'button name input',
              ref: register,
            }}
            fullWidth
          />
          <Controller
            name="actionId"
            defaultValue={button.actionId}
            control={control}
            render={({value, onChange}) => (
              <ActionSelect value={value} onChange={onChange} />
            )}
          />
          <Typography gutterBottom>Size</Typography>
          <Controller
            name="size"
            defaultValue={button.size || 0}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={1}
                max={12}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
          <FormControlLabel
            label="New Line"
            control={
              <Controller
                name="newLine"
                defaultValue={button.newLine || false}
                control={control}
                render={({value, onChange}) => (
                  <Checkbox checked={value} onChange={onChange} />
                )}
              />
            }
          />
          <Typography gutterBottom>Height</Typography>
          <Controller
            name="height"
            defaultValue={button.height || DEFAULT_BUTTON_HEIGHT}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={1}
                max={400}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
              />
            )}
          />
          <TargetConfig
            isAreaButton={isAreaButton}
            setIsAreaButton={setIsAreaButton}
            areaId={areaId}
            setAreaId={setAreaId}
            link={link}
            setLink={setLink}
            page={page}
            setPage={setPage}
            newTab={newTab}
            setNewTab={setNewTab}
          />
          <Controller
            name="backgroundColor"
            control={control}
            defaultValue={button.backgroundColor || ''}
            render={({value, onChange}) => (
              <ColorPicker
                label="Background Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
          <Controller
            name="hoverBackgroundColor"
            control={control}
            defaultValue={button.hoverBackgroundColor || ''}
            render={({value, onChange}) => (
              <ColorPicker
                label="Hover Background Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
          <Controller
            name="textColor"
            control={control}
            defaultValue={button.textColor || ''}
            render={({value, onChange}) => (
              <ColorPicker label="Text Color" color={value} onPick={onChange} />
            )}
          />
          <Controller
            name="borderColor"
            control={control}
            defaultValue={button.borderColor || ''}
            render={({value, onChange}) => (
              <ColorPicker
                label="Border Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
          <Controller
            name="hoverBorderColor"
            control={control}
            defaultValue={button.hoverBorderColor || ''}
            render={({value, onChange}) => (
              <ColorPicker
                label="Hover Border Color"
                color={value}
                onPick={onChange}
              />
            )}
          />
          <TextField
            name="borderWidth"
            defaultValue={button.borderWidth || ''}
            label="Border Width"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />
          <TextField
            name="borderRadius"
            defaultValue={button.borderRadius || ''}
            label="Border Radius"
            type="number"
            fullWidth
            inputProps={{
              min: 0,
              ref: register,
            }}
          />

          <Controller
            name="infusionsoftTag"
            control={control}
            defaultValue={button.infusionsoftTag}
            render={({value, onChange}) => (
              <InfusionsoftTagInput value={value} onChange={onChange} />
            )}
          />
          <SaveButton type="submit" />
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
        </form>
      </RuleConfig>
    </ComponentConfig>
  )
}
