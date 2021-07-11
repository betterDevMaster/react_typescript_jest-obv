import React, {useEffect, useState} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Box from '@material-ui/core/Box'
import ColorPicker from 'lib/ui/ColorPicker'
import {Panels, usePanels} from 'Event/template/Panels'
import {handleChangeSlider} from 'lib/dom'
import {spacing} from 'lib/ui/theme'
import {useUpdate} from 'Event/EventProvider'
import {useForm} from 'react-hook-form'
import {useToggle} from 'lib/toggle'
import BackgroundImage from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImage'
import BackgroundImageUpload from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImageUpload'
import BackgroundImageTable from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImageTable'
import PageSettingsDialog from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/PageSettingsDialog'
import {DEFAULT_BORDER_COLOR} from 'Event/template/Panels/Dashboard/Resources/Backgrounds'

const BORDER_RADIUS_SIZE_MIN = 0
const BORDER_RADIUS_SIZE_MAX = 60
const BORDER_THICKNESS_SIZE_MIN = 0
const BORDER_THICKNESS_SIZE_MAX = 60

export default function BackgroundsConfig() {
  const {flag: pageSettingsVisible, toggle: togglePageSettings} = useToggle()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {handleSubmit} = useForm()
  const {template} = usePanels()

  const templateSettings = template.zoomBackgrounds

  const updateEvent = useUpdate()

  const [borderColor, setBorderColor] = useState(DEFAULT_BORDER_COLOR)
  const [borderRadius, setBorderRadius] = useState(0)
  const [borderThickness, setBorderThickness] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  useEffect(() => {
    setBorderColor(templateSettings?.borderColor || DEFAULT_BORDER_COLOR)
    setBorderRadius(templateSettings?.borderRadius || 0)
    setBorderThickness(templateSettings?.borderThickness || 0)

    setLoading(false)
  }, [templateSettings])

  const submit = () => {
    if (processing) {
      return
    }

    toggleProcessing()
    clearError()

    const updatedTemplate: Panels = {
      ...template,
      zoomBackgrounds: {
        ...(template.zoomBackgrounds || {}),
        borderColor,
        borderRadius,
        borderThickness,
      },
    }

    updateEvent({
      template: updatedTemplate,
    })
      .catch(setError)
      .finally(toggleProcessing)
  }

  if (loading) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Typography variant="h6" gutterBottom>
        Zoom Backgrounds
      </Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          onClick={togglePageSettings}
          aria-label="configure zoom background"
        >
          Page Settings
        </Button>
      </Box>
      <PageSettingsDialog
        visible={pageSettingsVisible}
        onClose={togglePageSettings}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Image Appearance
          </Typography>
          <InputLabel>Border Color</InputLabel>
          <ColorPicker
            aria-label="border color"
            color={borderColor}
            label=""
            onPick={setBorderColor}
          />
          <InputLabel>Border Thickness</InputLabel>
          <Slider
            aria-label="border thickness"
            max={BORDER_THICKNESS_SIZE_MAX}
            min={BORDER_THICKNESS_SIZE_MIN}
            onChange={handleChangeSlider(setBorderThickness)}
            step={1}
            value={borderThickness}
            valueLabelDisplay="auto"
          />

          <InputLabel>Border Radius</InputLabel>
          <Slider
            aria-label="border radius"
            max={BORDER_RADIUS_SIZE_MAX}
            min={BORDER_RADIUS_SIZE_MIN}
            onChange={handleChangeSlider(setBorderRadius)}
            step={1}
            value={borderRadius}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Image Preview
          </Typography>
          <BackgroundImage
            alt="background"
            borderRadius={borderRadius}
            borderThickness={borderThickness}
            borderColor={borderColor}
            src="//placehold.jp/640x360.png"
            clickable={false}
            width="100%"
          />
        </Grid>
      </Grid>
      <Error>{error}</Error>
      <StyledSaveButton
        aria-label="create zoom backgrounds page"
        color="primary"
        disabled={processing}
        fullWidth
        type="submit"
        variant="contained"
      >
        Save Zoom Background Settings
      </StyledSaveButton>

      <Typography variant="h6" gutterBottom>
        Available Backgrounds
      </Typography>

      <BackgroundImageUpload />
      <BackgroundImageTable />
    </form>
  )
}

const StyledSaveButton = withStyles({
  root: {
    marginBottom: `${spacing[8]}!important`,
    marginTop: `${spacing[8]}!important`,
  },
})(Button)

const Error = (props: {children: string | null}) => {
  if (!props.children) {
    return null
  }

  return <ErrorText color="error">{props.children}</ErrorText>
}

const ErrorText = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(Typography)