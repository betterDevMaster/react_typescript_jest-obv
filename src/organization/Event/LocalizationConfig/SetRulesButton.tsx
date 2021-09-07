import {useEvent, useUpdate} from 'Event/EventProvider'
import {useLanguage} from 'Event/LanguageProvider'
import {Language} from 'Event/LanguageProvider/language'
import React, {useCallback, useState} from 'react'
import Button from '@material-ui/core/Button'
import {useLocalizationConfig} from 'organization/Event/LocalizationConfig'
import Dialog from 'lib/ui/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import RuleConfig from 'Event/attendee-rules/RuleConfig'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'

export default function SetRulesButton(props: {language: Language['name']}) {
  const {language} = props
  const {isProcessing, setIsProcessing} = useLocalizationConfig()
  const {event} = useEvent()
  const updateEvent = useUpdate()
  const {languages} = useLanguage()
  const [dialogVisible, setDialogVisible] = useState(false)
  const toggleDialog = () => setDialogVisible(!dialogVisible)

  const target = languages.find((l) => l.name === language)
  const save = useCallback(
    (rules) => {
      if (isProcessing || !target) {
        return
      }

      setIsProcessing(true)

      const updatedLanguage = {
        ...target,
        rules,
      }

      const updates = {
        localization: {
          ...(event.localization || {}),
          languages: languages.map((l) => {
            const isTarget = l.name === updatedLanguage.name
            if (!isTarget) {
              return l
            }

            return updatedLanguage
          }),
        },
      }

      updateEvent(updates).finally(() => {
        setIsProcessing(false)
      })
    },
    [event, isProcessing, setIsProcessing, updateEvent, target, languages],
  )

  const description =
    'Select this language for an attendee when the following rules match:'

  return (
    <>
      <Dialog
        open={dialogVisible && Boolean(target)}
        onClose={toggleDialog}
        fullWidth
      >
        <DialogContent>
          <Box py={3} px={1}>
            <StyledRuleConfig
              visible
              disabled={isProcessing}
              onChange={save}
              rules={target?.rules || []}
              description={description}
            />
          </Box>
        </DialogContent>
      </Dialog>
      <Button
        onClick={toggleDialog}
        variant="outlined"
        disabled={isProcessing}
        aria-label="set rules"
      >
        Selection Rules
      </Button>
    </>
  )
}

const StyledRuleConfig = styled(RuleConfig)`
  margin-bottom: 0;
`
