import React, {useState} from 'react'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from 'lib/ui/Dialog'
import {useVariables} from 'Event'
import DangerButton from 'lib/ui/Button/DangerButton'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import {Rule} from 'Event/visibility-rules'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import {
  Background,
  useBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import BackgroundImage from 'Event/template/Panels/Dashboard/Resources/Backgrounds/BackgroundsConfig/BackgroundImage'
import {DEFAULTS as TEMPLATE_DEFAULTS, usePanels} from 'Event/template/Panels'

const DEFAULT = TEMPLATE_DEFAULTS.zoomBackgrounds

export default function BackgroundImageEditDialog(props: {
  onClose: () => void
  isVisible: boolean
  background: Background
  onDone: () => void
}) {
  const {isVisible: visible, background, onClose, onDone} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const [rules, setRules] = useState<Rule[]>(background.settings?.rules || [])
  const {update, busy, remove} = useBackgrounds()
  const v = useVariables()
  const {
    template: {zoomBackgrounds: templateSettings},
  } = usePanels()

  const save = () => {
    update(background, {
      settings: {
        rules,
      },
    }).then(onDone)
  }

  return (
    <Dialog open={visible} onClose={onClose} fullWidth disableEnforceFocus>
      <DialogTitle>Zoom Background</DialogTitle>
      <DialogContent>
        <RuleConfig
          visible={ruleConfigVisible}
          close={toggleRuleConfig}
          rules={rules}
          onChange={setRules}
        >
          <Box pb={2}>
            <ConfigureRulesButton onClick={toggleRuleConfig} />
            <ImageContainer>
              <BackgroundImage
                alt="background"
                borderRadius={templateSettings.borderRadius}
                borderThickness={templateSettings.borderThickness}
                borderColor={
                  templateSettings?.borderColor || DEFAULT.borderColor
                }
                clickable={false}
                src={v(background.image.url)}
                width="100%"
              />
            </ImageContainer>
            <SaveButton
              fullWidth
              variant="contained"
              color="primary"
              disabled={busy}
              aria-label="save"
              onClick={save}
            >
              SAVE
            </SaveButton>
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label={`remove background image`}
              onClick={() => remove(background)}
              disabled={busy}
            >
              REMOVE
            </RemoveButton>
          </Box>
        </RuleConfig>
      </DialogContent>
    </Dialog>
  )
}

const ImageContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing[6]}!important;
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`

const SaveButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`

const RemoveButton = styled(DangerButton)`
  margin-bottom: ${(props) => props.theme.spacing[4]}!important;
`
