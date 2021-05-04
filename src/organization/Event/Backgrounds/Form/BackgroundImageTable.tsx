import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import {
  Background,
  ImagePreviewContainer,
  useBackgrounds,
} from 'organization/Event/Backgrounds/BackgroundsProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

export default function BackgroundImageTable() {
  const {
    backgrounds,
    backgroundsTemplateData: previewSettings,
    loading,
    isRemoving,
    removeBackground,
  } = useBackgrounds()

  const hasBackgrounds = backgrounds.length > 0

  if (loading) {
    return (
      <Box justifyContent="center" display="flex" paddingY={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (!hasBackgrounds) {
    return (
      <Box paddingY={4}>
        <Typography align="center">No Backgrounds Available</Typography>
      </Box>
    )
  }

  return (
    <Table>
      <TableBody>
        {backgrounds.map((background: Background) => (
          <TableRow key={background.id}>
            <TableCell component="td" scope="row" aria-label="image">
              <ImagePreviewContainer
                alt="background"
                borderRadius={previewSettings.borderRadius}
                borderThickness={previewSettings.borderThickness}
                borderColor={previewSettings.borderColor}
                clickable={false}
                src={background.image.url}
                width="200"
              />
            </TableCell>

            <TableCell
              component="td"
              scope="row"
              align="right"
              aria-label="actions"
            >
              <DangerButton
                variant="outlined"
                aria-label={`remove background image`}
                onClick={() => removeBackground(background.id)}
                disabled={isRemoving}
              >
                Remove
              </DangerButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
