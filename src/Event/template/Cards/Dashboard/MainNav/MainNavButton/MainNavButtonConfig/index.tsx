import {v4 as uuid} from 'uuid'
import TextField from '@material-ui/core/TextField'
import NavButton from 'Event/Dashboard/components/NavButton'
import {
  onChangeCheckedHandler,
  onUnknownChangeHandler,
  handleChangeSlider,
} from 'lib/dom'
import DangerButton from 'lib/ui/Button/DangerButton'
import ColorPicker from 'lib/ui/ColorPicker'
import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import Switch from 'lib/ui/form/Switch'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import IconPicker from 'lib/ui/form/IconPicker'
import {useCards} from 'Event/template/Cards'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Slider from '@material-ui/core/Slider'
import {CardsNavButtonProps} from 'Event/template/Cards/Dashboard/CardsNavButton'

export type ButtonConfigProps<K extends NavButton> = {
  button: K
  update: <T extends keyof K>(key: T) => (value: K[T]) => void
  disablePageSelect?: boolean
}

export function MainNavButtonConfig(
  props: ComponentConfigProps & {
    button: CardsNavButtonProps
    id?: string
  },
) {
  const {isVisible, onClose, id, button} = props
  const {template} = useCards()
  const {mainNav: buttons} = template

  const {register, control, handleSubmit} = useForm()

  const [rules, setRules] = useState(button.rules)
  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [areaId, setAreaId] = useState(button.areaId)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)
  const [isImageUploadButton, setIsImageUploadButton] = useState(
    button.isImageUpload,
  )
  const [hideRemoveButton, setHideRemoveButton] = useState<boolean>(!props.id)

  useEffect(() => {
    setHideRemoveButton(!props.id)
    if (isVisible) {
      return
    }

    setRules(button.rules)
    setIsAreaButton(button.isAreaButton)
    setAreaId(button.areaId)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
    setIsImageUploadButton(button.isImageUpload)
  }, [isVisible, button, props.id])

  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()

  const updateTemplate = useDispatchUpdate()

  const update = (id: string, updated: CardsNavButtonProps) => {
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

  const insert = (button: CardsNavButtonProps) => {
    const id = uuid()

    updateTemplate({
      mainNav: {
        ...buttons,
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
        ...buttons,
        entities: otherButtons,
        ids: updatedIds,
      },
    })
  }

  const save = (formData: any) => {
    const data: CardsNavButtonProps = {
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
              <IconPicker value={value} onChange={onChange} />
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
            defaultValue={button.actionId || ''}
            control={control}
            render={({value, onChange}) => (
              <ActionSelect value={value} onChange={onChange} />
            )}
          />
          <FormControl fullWidth>
            <InputLabel>Select Button Row</InputLabel>
            <Controller
              name="row"
              defaultValue={button.row}
              control={control}
              render={({value, onChange}) => (
                <Select
                  value={value}
                  onChange={onUnknownChangeHandler(onChange)}
                  label="Select Button Row"
                >
                  <MenuItem value={1}>Row 1</MenuItem>
                  <MenuItem value={2}>Row 2</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <TargetConfig
            isAreaButton={isAreaButton}
            setIsAreaButton={setIsAreaButton}
            areaId={areaId}
            setAreaId={setAreaId}
            isImageUpload={isImageUploadButton}
            setIsImageUploadButton={setIsImageUploadButton}
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
              <BackgroundPicker
                label="Background Color"
                background={value}
                onChange={onChange}
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
              <ColorPicker label="Font Color" color={value} onPick={onChange} />
            )}
          />
          <InputLabel>Font Size</InputLabel>
          <Controller
            name="fontSize"
            defaultValue={button.fontSize}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={0}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                onChange={handleChangeSlider(onChange)}
                value={value}
                aria-label="button font size"
              />
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
              hidden={hideRemoveButton}
            >
              REMOVE BUTTON
            </DangerButton>
          </Box>
        </form>
      </RuleConfig>
    </ComponentConfig>
  )
}
