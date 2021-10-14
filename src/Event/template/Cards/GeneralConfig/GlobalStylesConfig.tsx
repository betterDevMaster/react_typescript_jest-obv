import Box from '@material-ui/core/Box'
import {useCards} from 'Event/template/Cards'
import ColorPicker from 'lib/ui/ColorPicker'
import Switch from 'lib/ui/form/Switch'
import {SectionTitle} from 'organization/Event/GeneralConfig'
import React from 'react'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import {handleChangeSlider, onChangeCheckedHandler} from 'lib/dom'
import BackgroundImageUploader from 'Event/template/Cards/GeneralConfig/BackgroundImageUploader'

export default function GlobalStylesConfig() {
  const {template, update} = useCards()
  const updateBackground = update.object('background')

  return (
    <>
      <SectionTitle>Global Styles</SectionTitle>
      <Grid container justify="center" spacing={10}>
        <Grid item xs={4} md={2}>
          <Box mb={2}>
            <BackgroundImageUploader
              label="Background 1"
              property="backgroundImage1"
            />
          </Box>
        </Grid>
        <Grid item xs={4} md={2}>
          <Box mb={2}>
            <BackgroundImageUploader
              label="Background 2"
              property="backgroundImage2"
            />
          </Box>
        </Grid>
        <Grid item xs={4} md={2}>
          <Box mb={2}>
            <BackgroundImageUploader
              label="Background 3"
              property="backgroundImage3"
            />
          </Box>
        </Grid>
        <Grid item xs={4} md={2}>
          <Box mb={2}>
            <BackgroundImageUploader
              label="Background 4"
              property="backgroundImage4"
            />
          </Box>
        </Grid>
        <Grid item xs={4} md={2}>
          <Box mb={2}>
            <BackgroundImageUploader
              label="Background 5"
              property="backgroundImage5"
            />
          </Box>
        </Grid>
      </Grid>
      <Box mb={2}>
        <Switch
          checked={template.isDarkMode}
          onChange={onChangeCheckedHandler(update.primitive('isDarkMode'))}
          arial-label="set dark mode"
          labelPlacement="end"
          color="primary"
          label="Dark Mode"
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Background Color"
          color={template.background?.color}
          onPick={updateBackground('color')}
          aria-label="dashboard background color"
        />
      </Box>
      <InputLabel>Background Color Opacity</InputLabel>
      <Slider
        min={0}
        max={1}
        step={0.1}
        onChange={handleChangeSlider(updateBackground('opacity'))}
        valueLabelDisplay="auto"
        value={template.background.opacity}
        valueLabelFormat={() => <div>{template.background.opacity}</div>}
        aria-label="background color opacity"
      />
      <Box mb={2}>
        <ColorPicker
          label="Text Color"
          color={template.textColor}
          onPick={update.primitive('textColor')}
          aria-label="text color"
        />
      </Box>
      <Box mb={2}>
        <ColorPicker
          label="Link Color"
          color={template.linkColor}
          onPick={update.primitive('linkColor')}
          aria-label="link color"
        />
      </Box>
      <Box mb={2}>
        <Switch
          label="Link Underline"
          checked={template.linkUnderline}
          onChange={onChangeCheckedHandler(update.primitive('linkUnderline'))}
          labelPlacement="end"
          color="primary"
        />
      </Box>
    </>
  )
}
