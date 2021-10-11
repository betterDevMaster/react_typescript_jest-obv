import Button from '@material-ui/core/Button'
import React, {useState} from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Divider from '@material-ui/core/Divider'
import Tooltip from '@material-ui/core/Tooltip'
import {useAccessTokens} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'

export const ACCESS_TOKENS = 'Access Tokens'

export default function AccessTokens() {
  const [copiedToken, setCopiedToken] = useState('')

  const {
    addToken: newToken,
    processing,
    tokens,
    deleteToken,
  } = useAccessTokens()

  const copyCodeToClipboard = (accessToken: string) => {
    navigator.clipboard.writeText(accessToken).then(() => {
      setCopiedToken(accessToken)
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={newToken}
              aria-label="create access token"
              color="primary"
              variant="outlined"
              disabled={processing}
            >
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <List>
            <Divider />
            {tokens.map((token) => (
              <div key={token.value} aria-label="access-token-list-item">
                <ListItem selected={token.value === copiedToken}>
                  <ListItemText
                    primary={token.value}
                    disableTypography={true}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip
                      title={token.value === copiedToken ? 'Copied' : 'Copy'}
                    >
                      <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => copyCodeToClipboard(token.value)}
                      >
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteToken(token)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider key={token.value} />
              </div>
            ))}
          </List>
        </Grid>
      </Grid>
    </>
  )
}
