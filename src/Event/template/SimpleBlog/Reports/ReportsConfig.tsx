import React, {useState} from 'react'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Box from '@material-ui/core/Box'
import {onChangeCheckedHandler} from 'lib/dom'
import Header from 'Event/template/SimpleBlog/Reports/Header'
import Footer from 'Event/template/SimpleBlog/Reports/Footer'
import Body from 'Event/template/SimpleBlog/Reports/Body'
import FormsConfig from 'Event/template/SimpleBlog/Reports/Form/FormsConfig'
import {useReportsConfig} from 'organization/Event/ReportsConfig'

export const DEFAULT_TITLE = ''
export const DEFAULT_TITLE_COLOR = '#000000'
export const DEFAULT_FOOTER_TEXT = ''
export const DEFAULT_FOOTER_BACKGROUND_COLOR = '#FFFFFF'
export const DEFAULT_FOOTER_TEXT_COLOR = '#000000'
export const DEFAULT_BODY_BACKGROUND_COLOR = '#FFFFFF'
export const DEFAULT_BODY_BACKGROUND_OPACITY = 0

export default function SimpleBlogReportsConfig() {
  const [isPreview, setIsPreview] = useState(false)
  const {report, update} = useReportsConfig()

  const togglePreview = () => setIsPreview(!isPreview)

  const setIsActive = (is_active: boolean) => {
    update({
      is_active,
    })
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={report.is_active}
              onChange={onChangeCheckedHandler(setIsActive)}
              color="primary"
            />
          }
          label="Active"
        />
        <FormControlLabel
          control={<Switch onChange={togglePreview} color="primary" />}
          label="Preview"
        />
      </Box>
      <Header isPreview={isPreview} />
      <Body isPreview={isPreview} />
      <FormsConfig isPreview={isPreview} />
      <Footer isPreview={isPreview} />
    </>
  )
}
