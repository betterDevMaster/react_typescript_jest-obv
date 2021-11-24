import React from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import {
  SimpleBlog,
  useSimpleBlogTemplate,
  useSimpleBlogUpdate,
} from 'Event/template/SimpleBlog'
import ComponentConfig, {
  ComponentConfigProps,
  SaveButton,
} from 'organization/Event/DashboardConfig/ComponentConfig'
import {useForm} from 'react-hook-form'

export function BodyHTMLEmbedConfig(props: ComponentConfigProps) {
  const {isVisible: visible, onClose} = props
  const template = useSimpleBlogTemplate()
  const update = useSimpleBlogUpdate()
  const {handleSubmit, register} = useForm()

  const save = (data: Pick<SimpleBlog, 'bodyHTMLEmbed'>) => {
    update({
      ...data,
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
      <form onSubmit={handleSubmit(save)}>
        <TextField
          name="bodyHTMLEmbed"
          defaultValue={template.bodyHTMLEmbed}
          label="HTML"
          multiline
          rows={10}
          variant="outlined"
          fullWidth
          inputProps={{
            'aria-label': 'body embed html input',
            ref: register,
          }}
        />
        <SaveButton />
      </form>
    </ComponentConfig>
  )
}

const List = styled.ul`
  padding-left: ${(props) => props.theme.spacing[5]};
  margin: 0;
`
