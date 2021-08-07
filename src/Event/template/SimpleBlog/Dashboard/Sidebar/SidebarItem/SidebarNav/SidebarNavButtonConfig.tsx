import DangerButton from 'lib/ui/Button/DangerButton'
import React, {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import TextField from '@material-ui/core/TextField'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import Grid from '@material-ui/core/Grid'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import NavButton from 'Event/Dashboard/components/NavButton'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {Controller, useForm} from 'react-hook-form'
import {v4 as uuid} from 'uuid'
import {SidebarNavProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav'
import {useUpdateSidebarItem} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export function SidebarNavButtonConfig(
  props: ComponentConfigProps & {
    button: NavButton
    id?: string
    nav: SidebarNavProps
  },
) {
  const {button, id, isVisible, onClose, nav} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const updateItem = useUpdateSidebarItem()

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

  const {register, control, handleSubmit} = useForm()

  const update = (id: string, updated: NavButton) => {
    updateItem({
      ...nav,
      entities: {
        ...nav.entities,
        [id]: updated,
      },
    })
  }

  const removeButton = () => {
    if (!id) {
      throw new Error('Missing id')
    }

    const {[id]: target, ...otherButtons} = nav.entities
    const updatedIds = nav.ids.filter((i) => i !== id)

    onClose()
    updateItem({
      ...nav,
      entities: otherButtons,
      ids: updatedIds,
    })
  }

  const insert = (button: NavButton) => {
    const id = uuid()

    updateItem({
      ...nav,
      ids: [...nav.ids, id],
      entities: {
        ...nav.entities,
        [id]: button,
      },
    })
  }

  const save = (formData: any) => {
    const button: NavButton = {
      ...formData,
      rules,
      isAreaButton,
      areaId,
      link,
      page,
      newTab,
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
                  <ColorPicker
                    label="Background Color"
                    color={value}
                    onPick={onChange}
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
