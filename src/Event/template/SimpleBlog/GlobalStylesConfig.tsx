import Box from '@material-ui/core/Box'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import {onChangeCheckedHandler} from 'lib/dom'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {SectionTitle} from 'organization/Event/Page'
import Page from 'organization/Event/Page'
import Layout from 'organization/user/Layout'
import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import Button from '@material-ui/core/Button'

export default function GlobalStylesConfig() {
  const template = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {control, handleSubmit} = useForm()

  const submit = (
    data: Pick<SimpleBlog, 'textColor' | 'linkColor' | 'linkUnderline'>,
  ) => {
    update({...data})
  }

  return (
    <Layout>
      <Page>
        <SectionTitle>Global Styles</SectionTitle>
        <form onSubmit={handleSubmit(submit)}>
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
                  aria-label="link underline"
                />
              )}
            />
          </Box>
          <Button
            variant="contained"
            aria-label="save"
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </form>
      </Page>
    </Layout>
  )
}
