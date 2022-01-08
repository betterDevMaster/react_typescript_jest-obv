import React from 'react'
import {Controller, useForm} from 'react-hook-form'

import {Box, TextField} from '@material-ui/core'

import {
  NiftyFifty,
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {onChangeCheckedHandler} from 'lib/dom'

import Page, {SectionTitle} from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import {SaveButton} from 'organization/Event/DashboardConfig/ComponentConfig'

export default function GlobalStylesConfig() {
  const template = useNiftyFiftyTemplate()
  const update = useNiftyFiftyUpdate()

  const {register, handleSubmit, control} = useForm()

  const save = (data: NiftyFifty) => {
    update(data)
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Global Styles</SectionTitle>
        <form onSubmit={handleSubmit(save)}>
          <Box mb={2}>
            <Controller
              name="isDarkMode"
              defaultValue={template.isDarkMode}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  arial-label="set dark mode"
                  labelPlacement="end"
                  color="primary"
                  label="Dark Mode"
                />
              )}
            />
          </Box>
          <Box display="flex" flexDirection="row" flex="2">
            <Box flex="1">
              <Controller
                name="pageTitleColor"
                defaultValue={template.pageTitleColor}
                control={control}
                render={({value, onChange}) => (
                  <ColorPicker
                    label="Page Title Color"
                    color={value}
                    onPick={onChange}
                    aria-label="page title color"
                  />
                )}
              />
            </Box>
            <Box flex="1">
              <TextField
                name="pageTitleFontSize"
                defaultValue={template.pageTitleFontSize}
                label="Page Title Font Size"
                type="number"
                fullWidth
                inputProps={{
                  min: 0,
                  ref: register,
                }}
              />
            </Box>
          </Box>
          <Box mb={2}>
            <Controller
              name="textColor"
              defaultValue={template.textColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Text Color"
                  color={value}
                  onPick={onChange}
                  aria-label="text color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="linkColor"
              defaultValue={template.linkColor}
              control={control}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Link Color"
                  color={value}
                  onPick={onChange}
                  aria-label="link color"
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Controller
              name="linkUnderline"
              defaultValue={template.linkUnderline}
              control={control}
              render={({value, onChange}) => (
                <Switch
                  label="Link Underline"
                  checked={value}
                  onChange={onChangeCheckedHandler(onChange)}
                  labelPlacement="end"
                  color="primary"
                />
              )}
            />
          </Box>
          <SaveButton />
        </form>
      </Page>
    </Layout>
  )
}
