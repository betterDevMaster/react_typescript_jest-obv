import DangerButton from 'lib/ui/Button/DangerButton'
import React, {useEffect, useState, useCallback} from 'react'
import Box from '@material-ui/core/Box'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import ConfigureRulesButton from 'Event/attendee-rules/ConfigureRulesButton'
import TextField from '@material-ui/core/TextField'
import {onChangeCheckedHandler, handleChangeSlider} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import Grid from '@material-ui/core/Grid'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import {
  NavButtonProps,
  DEFAULT_FONT_SIZE,
} from 'Event/Dashboard/components/NavButton'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import {v4 as uuid} from 'uuid'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {useEditSidebarItem} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem'
import {REMOVE, useRemoveIfEmpty} from 'Event/TemplateUpdateProvider'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export function SidebarNavButtonConfig(
  props: ComponentConfigProps & {
    button: NavButtonProps
    id?: string
  },
) {
  const {button, id, isVisible, onClose} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {update: updateItem} = useEditSidebarItem()

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
    setIsImageUploadButton(button.isImageUpload)
    setAreaId(button.areaId)
    setLink(button.link)
    setPage(button.page)
    setNewTab(button.newTab)
  }, [isVisible, button, props.id])

  const {register, control, handleSubmit} = useForm()

  const update = (id: string, updated: NavButtonProps) => {
    updateItem({
      buttons: {
        [id]: updated,
      },
    })
  }

  const removeButton = useCallback(() => {
    if (!id) {
      throw new Error('Missing id')
    }

    onClose()
    updateItem({
      buttons: {
        [id]: REMOVE,
      },
    })
  }, [id, updateItem, onClose])

  useRemoveIfEmpty(removeButton, button, {shouldSkip: !id})

  const insert = (button: NavButtonProps) => {
    const id = uuid()

    updateItem({
      buttons: {
        [id]: button,
      },
    })
  }

  const save = (formData: any) => {
    const button: NavButtonProps = {
      ...formData,
      rules,
      isAreaButton,
      areaId,
      link,
      page,
      newTab,
      isImageUpload: isImageUploadButton,
    }

    if (id) {
      update(id, button)
      onClose()
      return
    }

    insert(button)
    onClose()
  }

  return (
    <ComponentConfig
      title="Sidebar Nav Button"
      isVisible={isVisible}
      onClose={onClose}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="textColor"
                control={control}
                defaultValue={button.textColor || ''}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Text Color"
                    color={value}
                    onPick={onChange}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="borderRadius"
                defaultValue={button.borderRadius || ''}
                label="Border Radius"
                type="number"
                fullWidth
                inputProps={{
                  min: MIN_BORDER_RADIUS,
                  max: MAX_BORDER_RADIUS,
                  ref: register,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="borderWidth"
                defaultValue={button.borderWidth || ''}
                label="Border Width"
                type="number"
                fullWidth
                inputProps={{
                  min: MIN_BORDER_WIDTH,
                  max: MAX_BORDER_WIDTH,
                  ref: register,
                }}
              />
            </Grid>
          </Grid>
          <Controller
            name="infusionsoftTag"
            control={control}
            defaultValue={button.infusionsoftTag}
            render={({value, onChange}) => (
              <InfusionsoftTagInput value={value} onChange={onChange} />
            )}
          />
          <InputLabel>Button Font Size</InputLabel>
          <Controller
            name="fontSize"
            defaultValue={button.fontSize || DEFAULT_FONT_SIZE}
            control={control}
            render={({value, onChange}) => (
              <Slider
                min={1}
                max={100}
                step={1}
                onChange={handleChangeSlider(onChange)}
                valueLabelDisplay="auto"
                value={value}
                aria-label="sidebar nav button font size"
              />
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
