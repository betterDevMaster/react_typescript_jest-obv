import React from 'react'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import {
  APPROVED,
  ImageEntry,
  REJECTED,
} from 'organization/Event/ImageEntriesProvider'
import Button from '@material-ui/core/Button'
import {useImageEntries} from 'organization/Event/ImageEntriesProvider'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useToggle} from 'lib/toggle'

export default function ImageEntryCard(props: {
  entry: ImageEntry
  setSelected: (entry: ImageEntry) => void
}) {
  const {entry, setSelected} = props

  const {approve, reject} = useImageEntries()

  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const handleAction = (action: () => Promise<void>) => () => {
    if (processing) {
      return
    }

    toggleProcessing()

    action().catch(toggleProcessing)
  }

  const canSet = (status: ImageEntry['status']) =>
    !processing && entry.status !== status

  return (
    <ImageEntryCardContainer item container direction="column">
      <ImageContainer container onClick={() => setSelected(entry)}>
        <ImageItem image={`${entry.file.url}`} aria-label="image entry" />
      </ImageContainer>
      <StyledButton
        variant="contained"
        color="primary"
        onClick={handleAction(() => approve(entry))}
        disabled={!canSet(APPROVED)}
      >
        Approve
      </StyledButton>
      <DangerButton
        variant="contained"
        color="primary"
        onClick={handleAction(() => reject(entry))}
        disabled={!canSet(REJECTED)}
      >
        Reject
      </DangerButton>
    </ImageEntryCardContainer>
  )
}

const ImageEntryCardContainer = styled((props: any) => {
  return <Grid {...props} />
})`
  margin: ${(props) => props.theme.spacing[3]};
  width: 180px;
  transition: transform 0.5s ease-in-out;
  z-index: 0;
`

const ImageContainer = styled((props: any) => {
  return <Grid {...props} />
})`
  height: 200px;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`

const ImageItem = styled.div<{image: string}>`
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
`

const StyledButton = styled(Button)`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
