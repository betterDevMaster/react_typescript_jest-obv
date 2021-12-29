import React, {useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {
  useNiftyFiftyTemplate,
  useNiftyFiftyUpdate,
} from 'Event/template/NiftyFifty'

export function BodyHTMLEmbedConfig(props: ComponentConfigProps) {
  const {isVisible: visible, onClose} = props
  const template = useNiftyFiftyTemplate()
  const update = useNiftyFiftyUpdate()
  const {bodyHTMLEmbed} = template

  const [embed, setEmbed] = useState(bodyHTMLEmbed)

  useEffect(() => {
    if (visible) {
      return
    }

    setEmbed(bodyHTMLEmbed)
  }, [visible, bodyHTMLEmbed])

  const save = () => {
    update({
      bodyHTMLEmbed: embed,
    })
    onClose()
  }

  return (
    <ComponentConfig title="Embed HTML" isVisible={visible} onClose={onClose}>
      <Box mb={4}>
        <Typography color="error" variant="h6">
          Important
        </Typography>

        <List>
          <li>
            <strong>
              Only insert HTML from trusted sources to avoid data leaks, or
              other malicious behavior.
            </strong>
          </li>
          <li>Turn on preview mode to insert HTML in editor.</li>
          <li>If the HTML crashes the app, refresh to try again.</li>
        </List>
      </Box>
      <TextField
        value={embed || ''}
        label="HTML"
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        onChange={onChangeStringHandler(setEmbed)}
        inputProps={{
          'aria-label': 'body embed html input',
        }}
      />
      <SaveButton onClick={save} />
    </ComponentConfig>
  )
}

const List = styled.ul`
  padding-left: ${(props) => props.theme.spacing[5]};
  margin: 0;
`
