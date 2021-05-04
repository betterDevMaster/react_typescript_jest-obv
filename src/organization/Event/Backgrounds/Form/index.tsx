import React, {useEffect, useRef, useState} from 'react'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import withStyles from '@material-ui/core/styles/withStyles'
import BackgroundImageTable from 'organization/Event/Backgrounds/Form/BackgroundImageTable'
import BackgroundImageUpload from 'organization/Event/Backgrounds/Form/BackgroundImageUpload'
import ColorPicker from 'lib/ui/ColorPicker'
import TextEditor from 'lib/ui/form/TextEditor'
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

const FONT_SIZE_MIN = 5
const FONT_SIZE_MAX = 50
const BORDER_RADIUS_SIZE_MIN = 0
const BORDER_RADIUS_SIZE_MAX = 60
const BORDER_THICKNESS_SIZE_MIN = 0
const BORDER_THICKNESS_SIZE_MAX = 60
const PER_ROW_MIN = 1
const PER_ROW_MAX = 3

export default function Form() {
  const mounted = useRef(true)
  const template = useTemplate()
  const {event} = useEvent()
  const {errors, handleSubmit, register, setValue, watch} = useForm()
  const {
    requestError,
    isRemoving,
    isSubmitting,
    isUploading,
    loading,
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

  const [descriptionColor, setDescriptionColor] = useState(
    zoomBackgrounds.description.color,
  )
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    zoomBackgrounds.description.fontSize,
  )
  const [borderColor, setBorderColor] = useState(zoomBackgrounds.borderColor)
  const [borderThickness, setBorderThickness] = useState(
    zoomBackgrounds.borderThickness,
  )
  const [borderRadius, setBorderRadius] = useState(zoomBackgrounds.borderRadius)
  const [imagesPerRow, setImagesPerRow] = useState(zoomBackgrounds.imagesPerRow)

  // These fields require validation, so they don't go into state the way the
  // slider/picker values do.
  const title = watch('title', event.zoom_backgrounds_title)
  const body = watch('body', event.zoom_backgrounds_description)

  useEffect(() => {
    if (!mounted.current) {
      return
    }

    if (!event.zoom_backgrounds_title) {
      return
    }

    setValue('title', event.zoom_backgrounds_title)
    setValue('body', event.zoom_backgrounds_description)

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
      description: {
        color: descriptionColor,
        fontSize: descriptionFontSize,
      },
    })
  }

  const textEditor =
    loading === true ? null : (
      <TextEditor data={body} onChange={(value) => setValue('body', value)} />
    )

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Typography variant="h6" gutterBottom>
        Zoom Backgrounds
      </Typography>

      <TextField
        name="title"
        label="Zoom Backgrounds Page Title *"
        fullWidth
        inputProps={{
          ref: register,
          'aria-label': 'zoom backgrounds page title',
          required: 'Title is required',
        }}
        defaultValue={title}
      />

      <Editor>
        <input
          aria-label="zoom backgrounds body"
          name="body"
          ref={register({required: 'Body is required.'})}
          type="hidden"
        />
        <BodyLabel required error={!!errors.body}>
          Body
        </BodyLabel>
        {textEditor}
        <BodyError error={errors.body} />
      </Editor>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputLabel>Description Color</InputLabel>
          <ColorPicker
            aria-label="description color"
            color={descriptionColor}
            label=""
            onPick={setDescriptionColor}
          />

          <InputLabel>Description Font Size</InputLabel>
          <Slider
            aria-label="description font size"
            max={FONT_SIZE_MAX}
            min={FONT_SIZE_MIN}
            onChange={handleChangeSlider(setDescriptionFontSize)}
            step={1}
            value={descriptionFontSize}
            valueLabelDisplay="auto"
          />

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

const BodyLabel = withStyles({
  root: {
    marginBottom: spacing[3],
  },
})(InputLabel)

const BodyError = (props: {error?: {message: string}}) => {
  return typeof props.error === 'undefined' ? null : (
    <FormHelperText error>{props.error.message}</FormHelperText>
  )
}

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

const Editor = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]};
  margin-bottom: ${(props) => props.theme.spacing[6]};

  .ck-editor__editable_inline {
    min-height: 300px;
    max-height: 600px;
  }
`
