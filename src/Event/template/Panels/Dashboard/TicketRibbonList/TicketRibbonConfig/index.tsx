import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import {usePanels} from 'Event/template/Panels'
import {TicketRibbon} from 'Event/template/Panels/Dashboard/TicketRibbonList/TicketRibbon'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import ColorPicker from 'lib/ui/ColorPicker'
import FontStyleInput from 'lib/ui/typography/FontStyleInput'
import ComponentConfig, {
  ComponentConfigProps,
  RemoveButton,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import TicketRibbonUpload from 'organization/Event/DashboardConfig/TicketRibbonUpload'
import {useDeleteCustomRibbon} from 'organization/Event/DashboardConfig/TicketRibbonUpload/UploadedTicketRibbon'
import React, {useEffect, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import Box from '@material-ui/core/Box'
import {DeepRequired} from 'lib/type-utils'
import {handleChangeSlider} from 'lib/dom'
import Slider from '@material-ui/core/Slider'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'

const MAX_HOVER_TEXT_CHARS = 15

export default function TicketRibbonConfig(
  props: ComponentConfigProps & {
    ticketRibbon: DeepRequired<TicketRibbon>
    index?: number
  },
) {
  const {index, isVisible, onClose, ticketRibbon} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [processing, setProcessing] = useState(false)
  const deleteCustomRibbon = useDeleteCustomRibbon()
  const {control, handleSubmit, register, errors} = useForm()
  const saveTemplate = useDispatchUpdate()
  const {
    template: {ticketRibbons},
  } = usePanels()

  const [rules, setRules] = useState(ticketRibbon.rules)
  const [letterUpload, setLetterUpload] = useState(ticketRibbon.letterUpload)
  const [hoverUpload, setHoverUpload] = useState(ticketRibbon.hoverUpload)
  const [hoverTextFontStyles, setHoverTextFontStyles] = useState(
    ticketRibbon.hoverTextFontStyles,
  )

  /**
   * The user might be updating the width in which case we'd need to dynamically
   * update the image upload as well, so we'll maintain local state
   * here.
   */
  const [hoverImageWidth, setHoverImageWidth] = useState(
    ticketRibbon.hoverImageWidth,
  )

  /**
   * Set defaults for anything that can't be set via defaultValue
   */
  useEffect(() => {
    if (isVisible) {
      return
    }

    setRules(ticketRibbon.rules)
    setLetterUpload(ticketRibbon.letterUpload)
    setHoverUpload(ticketRibbon.hoverUpload)
    setHoverTextFontStyles(ticketRibbon.hoverTextFontStyles)
    setHoverImageWidth(ticketRibbon.hoverImageWidth)
  }, [isVisible, ticketRibbon])

  const update = (index: number, updated: TicketRibbon) => {
    saveTemplate({
      ticketRibbons: ticketRibbons.map((tr, i) => {
        const isTarget = i === index
        if (isTarget) {
          return updated
        }

        return tr
      }),
    })
  }

  const insert = (newRibbon: TicketRibbon) => {
    saveTemplate({
      ticketRibbons: [...ticketRibbons, newRibbon],
    })
  }

  const remove = async () => {
    if (index === undefined) {
      throw new Error('Missing index for ticket ribbon')
    }

    try {
      if (ticketRibbon.letterUpload) {
        await deleteCustomRibbon(ticketRibbon.letterUpload)
      }

      if (ticketRibbon.hoverUpload) {
        await deleteCustomRibbon(ticketRibbon.hoverUpload)
      }
    } catch {
      // Ignore failing to delete images
    }

    const removed = ticketRibbons.filter((_, i) => i !== index)
    onClose()
    saveTemplate({
      ticketRibbons: removed,
    })
  }

  const save = (formData: any) => {
    const ribbon: TicketRibbon = {
      ...formData,
      rules,
      letterUpload,
      hoverUpload,
      hoverTextFontStyles,
      hoverImageWidth,
    }

    if (index === undefined) {
      insert(ribbon)
    } else {
      update(index, ribbon)
    }

    onClose()
  }

  return (
    <ComponentConfig
      isVisible={isVisible}
      onClose={onClose}
      title="Ticket Ribbon"
    >
      <RuleConfig
        visible={ruleConfigVisible}
        close={toggleRuleConfig}
        rules={rules}
        onChange={setRules}
      >
        <>
          <ConfigureRulesButton onClick={toggleRuleConfig} />
          <form onSubmit={handleSubmit(save)}>
            <Controller
              name="backgroundColor"
              control={control}
              defaultValue={ticketRibbon.backgroundColor}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Background Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />
            <Controller
              name="textColor"
              control={control}
              defaultValue={ticketRibbon.textColor}
              render={({value, onChange}) => (
                <ColorPicker
                  label="Text Color"
                  color={value}
                  onPick={onChange}
                />
              )}
            />
            <Box mb={1}>
              <InputLabel>Letter Image</InputLabel>
            </Box>
            <TicketRibbonUpload
              processing={processing}
              setProcessing={setProcessing}
              customRibbon={letterUpload}
              setCustomRibbon={setLetterUpload}
              width={30}
              height={65}
            />
            <InputLabel>Hover Image Width</InputLabel>

            <Slider
              min={80}
              max={200}
              step={1}
              value={hoverImageWidth || 0}
              onChange={handleChangeSlider(setHoverImageWidth)}
              valueLabelDisplay="auto"
              aria-label="hover image width"
            />

            <Box mb={1}>
              <InputLabel>Hover Image</InputLabel>
            </Box>
            <TicketRibbonUpload
              processing={processing}
              setProcessing={setProcessing}
              customRibbon={hoverUpload}
              setCustomRibbon={setHoverUpload}
              width={hoverImageWidth}
              height={30}
            />
            <TextField
              name="letter"
              defaultValue={ticketRibbon.letter}
              label="Letter"
              fullWidth
              inputProps={{
                ref: register,
                'aria-label': 'letter input',
              }}
            />
            <TextField
              name="hoverText"
              defaultValue={ticketRibbon.hoverText}
              label="Text"
              fullWidth
              inputProps={{
                ref: register({
                  maxLength: {
                    value: MAX_HOVER_TEXT_CHARS,
                    message: `Hover text must be below ${MAX_HOVER_TEXT_CHARS} characters`,
                  },
                }),
                'aria-label': 'hover text input',
              }}
              error={Boolean(errors.hoverText)}
              helperText={errors.hoverText?.message || ''}
            />
            <FontStyleInput
              onChange={setHoverTextFontStyles}
              value={hoverTextFontStyles || []}
            />
            <SaveButton type="submit" />
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label="remove ticket ribbon"
              onClick={remove}
            >
              REMOVE TICKET RIBBON
            </RemoveButton>
          </form>
        </>
      </RuleConfig>
    </ComponentConfig>
  )
}
