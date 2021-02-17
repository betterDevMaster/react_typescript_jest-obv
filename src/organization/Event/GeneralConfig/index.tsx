import React, {useCallback, useEffect, useState} from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import ColorPicker from 'lib/ui/ColorPicker'
import {useEvent} from 'Event/EventProvider'
import TemplateProvider, {
  useTemplate,
  useUpdateTemplate,
} from 'Event/Dashboard/state/TemplateProvider'
import ProgressBarPreview from 'organization/Event/GeneralConfig/ProgressBarPreview'
import SelectTemplateForm from 'organization/Event/DashboardConfig/SelectTemplateForm'
import {Template} from 'Event/template'
import Typography from '@material-ui/core/Typography'

export interface ProgressBar {
  background: string
  textColor: string
}

export default function GeneralConfig() {
  const {event} = useEvent()

  if (!event.template) {
    return <SelectTemplateForm />
  }

  return (
    <TemplateProvider template={event.template}>
      <Content />
    </TemplateProvider>
  )
}

function Content() {
  const updateTemplate = useUpdateTemplate()
  const {progressBar} = useTemplate()
  const [barColor, setBarColor] = useState(progressBar.barColor)
  const [textColor, setTextColor] = useState(progressBar.textColor)

  const update = useCallback(
    <K extends keyof Template>(key: K, value: Template[K]) => {
      updateTemplate({
        [key]: value,
      })
    },
    [updateTemplate],
  )

  useEffect(() => {
    const updatedBarColor = progressBar.barColor !== barColor
    const updatedTextColor = progressBar.textColor !== textColor
    const hasUpdate = updatedBarColor || updatedTextColor

    if (!hasUpdate) {
      return
    }

    update('progressBar', {
      barColor,
      textColor,
    })
  }, [barColor, textColor, progressBar, update])

  return (
    <Layout>
      <Page>
        <Typography variant="h6">Progress Bar</Typography>
        <ProgressBarPreview barColor={barColor} textColor={textColor} />
        <ColorPicker
          label="Bar Color"
          color={barColor}
          onPick={setBarColor}
          aria-label="bar color"
        />
        <ColorPicker
          label="Text Color"
          color={textColor}
          onPick={setTextColor}
          aria-label="text color"
        />
      </Page>
    </Layout>
  )
}
