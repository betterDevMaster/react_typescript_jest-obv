import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import InputLabel from '@material-ui/core/InputLabel'
import ColorPicker from 'lib/ui/ColorPicker'
import {handleChangeSlider, onChangeStringHandler} from 'lib/dom'
import {colors} from 'lib/ui/theme'
import {Panels, usePanels} from 'Event/template/Panels'
import {withDefault} from 'lib/template'
import {PreviewBox, SectionTitle} from 'organization/Event/GeneralConfig'
import {TemplateSetPasswordForm} from 'Event/Step1/SetPasswordForm'
import {useTeamMember} from 'organization/auth'

const MIN_BORDER_RADIUS = 0
const MAX_BORDER_RADIUS = 60

type SetPassword = NonNullable<Panels['setPasswordForm']>
type SetPasswordButton = NonNullable<SetPassword['button']>

export const DEFAULT_TITLE = 'Please set a password to continue'
export const DEFAULT_PASSWORD_LABEL = 'Password'
export const DEFAULT_CONFIRM_PASSWORD_LABEL = 'Confirm Password'
export const DEFAULT_BUTTON_TEXT = 'SUBMIT'
export const DEFAULT_BUTTON_BACKGROUND_COLOR = colors.primary
export const DEFAULT_BUTTON_TEXT_COLOR = '#FFFFFF'
export const DEFAULT_BUTTON_BORDER_COLOR = '#FFFFFF'
export const DEFAULT_BUTTON_BORDER_RADIUS = 56
export const DEFAULT_BUTTON_BORDER_WIDTH = 0

export default function SetPasswordFormConfig() {
  const {template, update} = usePanels()
  const user = useTeamMember()
  const {setPasswordForm} = template

  const updateSetPasswordForm = update.object('setPasswordForm')

  const updateButton =
    <T extends keyof SetPasswordButton>(key: T) =>
    (value: SetPasswordButton[T]) => {
      const current = setPasswordForm?.button || {}
      const button = {
        ...current,
        [key]: value,
      }

      updateSetPasswordForm('button')(button)
    }

  return (
    <>
      <SectionTitle>Set Password Form</SectionTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={setPasswordForm?.title || DEFAULT_TITLE}
                label="Title"
                fullWidth
                inputProps={{
                  'aria-label': 'set password form title',
                }}
                onChange={onChangeStringHandler(updateSetPasswordForm('title'))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={setPasswordForm?.description || ''}
                label="Description"
                fullWidth
                inputProps={{
                  'aria-label': 'set password form description',
                }}
                onChange={onChangeStringHandler(
                  updateSetPasswordForm('description'),
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={setPasswordForm?.passwordLabel || DEFAULT_PASSWORD_LABEL}
                label="Password Label"
                fullWidth
                inputProps={{
                  'aria-label': 'password label',
                }}
                onChange={onChangeStringHandler(
                  updateSetPasswordForm('passwordLabel'),
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={
                  setPasswordForm?.confirmPasswordLabel ||
                  DEFAULT_CONFIRM_PASSWORD_LABEL
                }
                label="Confirm Password Label"
                fullWidth
                inputProps={{
                  'aria-label': 'confirm password label',
                }}
                onChange={onChangeStringHandler(
                  updateSetPasswordForm('confirmPasswordLabel'),
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                value={withDefault(
                  DEFAULT_BUTTON_TEXT,
                  setPasswordForm?.button?.text,
                )}
                label="Button Label"
                fullWidth
                inputProps={{
                  'aria-label': 'submit button label',
                }}
                onChange={onChangeStringHandler(updateButton('text'))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Button Background Color"
                color={
                  setPasswordForm?.button?.backgroundColor ||
                  DEFAULT_BUTTON_BACKGROUND_COLOR
                }
                onPick={updateButton('backgroundColor')}
                aria-label="button background color"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Button Hover Background Color"
                color={
                  setPasswordForm?.button?.hoverBackgroundColor ||
                  DEFAULT_BUTTON_BACKGROUND_COLOR
                }
                onPick={updateButton('hoverBackgroundColor')}
                aria-label="button hover background color"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPicker
                label="Button Text Color"
                color={
                  setPasswordForm?.button?.textColor ||
                  DEFAULT_BUTTON_TEXT_COLOR
                }
                onPick={updateButton('textColor')}
                aria-label="button text color"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel>Border Radius</InputLabel>
              <Slider
                valueLabelDisplay="auto"
                aria-label="button border radius"
                value={withDefault(
                  DEFAULT_BUTTON_BORDER_RADIUS,
                  setPasswordForm?.button?.borderRadius,
                )}
                onChange={handleChangeSlider(updateButton('borderRadius'))}
                step={1}
                min={MIN_BORDER_RADIUS}
                max={MAX_BORDER_RADIUS}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <PreviewBox>
            <TemplateSetPasswordForm
              submit={() => {}}
              submitting={false}
              responseError={null}
              progress={25}
              user={user}
            />
          </PreviewBox>
        </Grid>
      </Grid>
    </>
  )
}
