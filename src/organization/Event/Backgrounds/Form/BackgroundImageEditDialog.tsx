import React, {useState} from 'react'
import styled from 'styled-components'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from 'lib/ui/Dialog'
import {ObvioEvent, useVariables} from 'Event'
import {
  Background,
  BackgroundsTemplateData,
  ImagePreviewContainer,
} from '../BackgroundsProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import RuleConfig, {useRuleConfig} from 'Event/visibility-rules/RuleConfig'
import {Rule} from 'Event/visibility-rules'
import ConfigureRulesButton from 'Event/visibility-rules/ConfigureRulesButton'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'

export default function BackgroundImageEditDialog(props: {
  onClose: () => void
  visible: boolean
  settings: BackgroundsTemplateData
  background: Background
  handleRemove: () => void
  onDone: (event: ObvioEvent) => void
}) {
  const [saving, setSaving] = useState(false)
  const {visible, settings, background, handleRemove, onClose, onDone} = props
  const {visible: ruleConfigVisible, toggle: toggleRuleConfig} = useRuleConfig()
  const {client} = useOrganization()
  const [rules, setRules] = useState<Rule[]>(background.settings?.rules || [])
  const v = useVariables()

  const save = () => {
    const url = api(`/backgrounds/${background.id}`)
    setSaving(true)
    client
      .put<ObvioEvent>(url, {settings: {rules}})
      .then((event: ObvioEvent) => {
        onDone(event)
      })
      .finally(() => setSaving(false))
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
              <ImagePreviewContainer
                alt="background"
                borderRadius={settings.borderRadius}
                borderThickness={settings.borderThickness}
                borderColor={v(settings.borderColor)}
                clickable={false}
                src={v(background.image.url)}
                width="100%"
              />
            </ImageContainer>
            <SaveButton
              fullWidth
              variant="contained"
              color="primary"
              disabled={saving}
              aria-label="save"
              onClick={save}
            >
              SAVE
            </SaveButton>
            <RemoveButton
              fullWidth
              variant="outlined"
              aria-label={`remove background image`}
              onClick={handleRemove}
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
