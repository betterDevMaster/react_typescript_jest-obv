import React from 'react'
import TextField from '@material-ui/core/TextField'
import {onChangeStringHandler} from 'lib/dom'
import {BODY_HTML_EMBED} from 'Event/template/SimpleBlog/Dashboard/BodyHTMLEmbed'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Dialog from 'lib/ui/Dialog'
import {usePanels} from 'Event/template/Panels'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'

export type BodyHTMLEmbedConfig = {
  type: typeof BODY_HTML_EMBED
}

export function BodyHTMLEmbedConfig(props: {
  isVisible: boolean
  onClose: () => void
}) {
  const {isVisible, onClose} = props
  const {template, update} = usePanels()
  const {bodyHTMLEmbed} = template
  const updateHTML = update.primitive('bodyHTMLEmbed')

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <DialogTitle>Body Embed HTML</DialogTitle>
      <DialogContent>
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
          value={bodyHTMLEmbed || ''}
          label="HTML"
          multiline
          rows={10}
          variant="outlined"
          fullWidth
          onChange={onChangeStringHandler(updateHTML)}
          inputProps={{
            'aria-label': 'body embed html input',
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const List = styled.ul`
  padding-left: ${(props) => props.theme.spacing[5]};
  margin: 0;
`
