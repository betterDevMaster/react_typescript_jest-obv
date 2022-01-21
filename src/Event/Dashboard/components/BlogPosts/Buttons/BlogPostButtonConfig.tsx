import React, {useState, useCallback} from 'react'
import Box from '@material-ui/core/Box'
import DangerButton from 'lib/ui/Button/DangerButton'
import TextField from '@material-ui/core/TextField'
import {onChangeCheckedHandler} from 'lib/dom'
import Switch from 'lib/ui/form/Switch'
import Grid from '@material-ui/core/Grid'
import InfusionsoftTagInput from 'organization/Event/DashboardConfig/InfusionsoftTagInput'
import ColorPicker from 'lib/ui/ColorPicker'
import TargetConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig'
import ActionSelect from 'Event/ActionsProvider/ActionSelect'
import BackgroundPicker from 'lib/ui/form/BackgroundPicker'
import MailchimpTagInput from 'organization/Event/DashboardConfig/MailchimpTagInput'
import {Controller, useForm} from 'react-hook-form'
import ComponentConfig, {
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import RuleConfig, {useRuleConfig} from 'Event/attendee-rules/RuleConfig'
import {
  REMOVE,
  useRemoveIfEmpty,
  useTemplateUpdate,
} from 'Event/TemplateUpdateProvider'
import {v4 as uuid} from 'uuid'
import {NavButtonProps} from 'Event/Dashboard/components/NavButton'

const MIN_BORDER_WIDTH = 0
const MAX_BORDER_WIDTH = 50

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 50

export const DEFAULT_BUTTON_WIDTH_PERCENT = 100

export default function BlogPostButtonConfig(props: {
  showing: boolean
  onClose: () => void
  postId: string
  id?: string
  button: NavButtonProps
}) {
  const {button, postId, id, onClose, showing} = props
  const [rules, setRules] = useState(button.rules)
  const {visible: showingRuleConfig, toggle: toggleRuleConfig} = useRuleConfig()
  const {register, handleSubmit, control} = useForm()
  const update = useTemplateUpdate()

  // Init target config values since target config is a pre-refactor
  // component that expects local state for configs.
  const [isAreaButton, setIsAreaButton] = useState(button.isAreaButton)
  const [isImageUpload, setIsImageUpload] = useState(button.isImageUpload)
  const [areaId, setAreaId] = useState(button.areaId)
  const [link, setLink] = useState(button.link)
  const [page, setPage] = useState(button.page)
  const [newTab, setNewTab] = useState(button.newTab)

  const set = (id: string, button: NavButtonProps) => {
    update({
      blogPosts: {
        [postId]: {
          buttons: {
            [id]: button,
          },
        },
      },
    })
  }

  const removeButton = useCallback(() => {
    if (!id) {
      throw new Error('Missing button id')
    }

    update({
      blogPosts: {
        [postId]: {
          buttons: {
            [id]: REMOVE,
          },
        },
      },
    })
  }, [update, id, postId])

  useRemoveIfEmpty(removeButton, button, {
    shouldSkip: !id,
  })

  const submit = (form: NavButtonProps) => {
    const data: NavButtonProps = {
      ...form,
      isAreaButton,
      isImageUpload,
      areaId,
      link,
      page,
      newTab,
      rules,
    }

    let id = props.id || uuid()

    set(id, data)
    onClose()
  }

  return (
    <ComponentConfig
      isVisible={showing}
      onClose={onClose}
      title="Blog Post Button"
    >
      <RuleConfig
        visible={showingRuleConfig}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <form onSubmit={handleSubmit(submit)}>
          <Box mb={3}>
            <Controller
              defaultValue={button.isVisible}
              name="isVisible"
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  arial-label="config switch to attendee"
                  labelPlacement="end"
                  color="primary"
                  label="Enabled"
                />
              )}
            />
            <TextField
              label="Text"
              name="text"
              defaultValue={button.text}
              inputProps={{
                ref: register,
                'aria-label': 'button name input',
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
              disablePageSelect
              isAreaButton={isAreaButton}
              setIsAreaButton={setIsAreaButton}
              isImageUpload={isImageUpload}
              setIsImageUploadButton={setIsImageUpload}
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
                  defaultValue={button.backgroundColor || ''}
                  control={control}
                  render={({value, onChange}) => (
                    <BackgroundPicker
                      label="Background"
                      background={value}
                      onChange={onChange}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="textColor"
                  defaultValue={button.textColor || ''}
                  control={control}
                  render={({value, onChange}) => (
                    <ColorPicker
                      label="Text Color"
                      color={value}
                      onPick={onChange}
                      aria-label="text color color"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="borderColor"
                  defaultValue={button.borderColor || ''}
                  control={control}
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
                  defaultValue={button.borderRadius || 0}
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
                  defaultValue={button.borderWidth || 0}
                  label="Border Thickness"
                  type="number"
                  fullWidth
                  inputProps={{
                    min: MIN_BORDER_WIDTH,
                    max: MAX_BORDER_WIDTH,
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="padding"
                  defaultValue={button.padding || 0}
                  label="Padding"
                  type="number"
                  fullWidth
                  inputProps={{
                    ref: register,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="fontSize"
                  defaultValue={button.fontSize || ''}
                  label="Font Size"
                  type="number"
                  fullWidth
                  inputProps={{
                    ref: register,
                  }}
                />
              </Grid>
            </Grid>
            <Controller
              name="infusionsoftTag"
              defaultValue={button.infusionsoftTag}
              control={control}
              render={({value, onChange}) => (
                <InfusionsoftTagInput value={value} onChange={onChange} />
              )}
            />
            <Controller
              name="mailchimpTag"
              defaultValue={button.mailchimpTag}
              control={control}
              render={({value, onChange}) => (
                <MailchimpTagInput value={value} onChange={onChange} />
              )}
            />
          </Box>
          <SaveButton />
          <Box mb={2}>
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
