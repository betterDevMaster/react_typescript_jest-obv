import React, {useEffect, useRef, useState} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Box from '@material-ui/core/Box'
import BackgroundImageTable from 'organization/Event/Backgrounds/Form/BackgroundImageTable'
import BackgroundImageUpload from 'organization/Event/Backgrounds/Form/BackgroundImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import {
  BackgroundsData,
  ImagePreviewContainer,
  useBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import {createSimpleBlog} from 'Event/template/SimpleBlog'
import {handleChangeSlider} from 'lib/dom'
import {spacing} from 'lib/ui/theme'
import {useEvent} from 'Event/EventProvider'
import {useForm} from 'react-hook-form'
import {useTemplate} from 'Event/TemplateProvider'
import PageSettingsDialog from 'organization/Event/Backgrounds/Form/PageSettingsDialog'

const BORDER_RADIUS_SIZE_MIN = 0
const BORDER_RADIUS_SIZE_MAX = 60
const BORDER_THICKNESS_SIZE_MIN = 0
const BORDER_THICKNESS_SIZE_MAX = 60
const PER_ROW_MIN = 1
const PER_ROW_MAX = 3

export default function Form() {
  const [pageSettingsVisible, setPageSettingsVisible] = useState(false)

  const togglePageSettings = () => setPageSettingsVisible(!pageSettingsVisible)

  const mounted = useRef(true)
  const template = useTemplate()
  const {event} = useEvent()
  const {handleSubmit, setValue} = useForm()
  const {
    requestError,
    isRemoving,
    isSubmitting,
    isUploading,
    setBackgroundData,
  } = useBackgrounds()

  // Zoom Backgrounds-specific template data.
  const {zoomBackgrounds: templateSettings} = template
  // Defaults for Zoom Backgrounds-specific template data.
  const {zoomBackgrounds: templateDefaults} = createSimpleBlog()

  // If we don't have Zoom Backgrounds settings from the template (self-migrating
  // existing events...), use the defaults defined in the SimpleBlog object so
  // that there are settings to use/save moving forward for Events that already
  // exist.
  const zoomBackgrounds =
    typeof templateSettings !== 'undefined'
      ? templateSettings
      : templateDefaults

  const [borderColor, setBorderColor] = useState(zoomBackgrounds.borderColor)
  const [borderThickness, setBorderThickness] = useState(
    zoomBackgrounds.borderThickness,
  )
  const [borderRadius, setBorderRadius] = useState(zoomBackgrounds.borderRadius)
  const [imagesPerRow, setImagesPerRow] = useState(zoomBackgrounds.imagesPerRow)

  // These fields require validation, so they don't go into state the way the
  // slider/picker values do.

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.zoom_backgrounds_title) {
      return
    }

    setValue('zoom_backgrounds_title', event.zoom_backgrounds_title)
    setValue('zoom_backgrounds_description', event.zoom_backgrounds_description)

    return () => {
      mounted.current = false
    }
  }, [event, setValue])

  const submit = (data: BackgroundsData) => {
    setBackgroundData(data, {
      borderColor: borderColor,
      borderRadius: borderRadius,
      borderThickness: borderThickness,
      imagesPerRow: imagesPerRow,
      backToDashboardText: zoomBackgrounds.backToDashboardText,
      backToDashboardTextColor: zoomBackgrounds.backToDashboardTextColor,
    })
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

          <Typography variant="h6" gutterBottom>
            Image Display
          </Typography>

          <InputLabel>Number of Images per row</InputLabel>
          <Slider
            aria-label="images per row"
            max={PER_ROW_MAX}
            min={PER_ROW_MIN}
            onChange={handleChangeSlider(setImagesPerRow)}
            step={1}
            value={imagesPerRow}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Image Preview
          </Typography>
          <ImagePreviewContainer
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

      <Error>{requestError}</Error>

      <StyledSaveButton
        aria-label="create zoom backgrounds page"
        color="primary"
        disabled={isRemoving || isSubmitting || isUploading}
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

const Error = (props: {children: string}) => {
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
