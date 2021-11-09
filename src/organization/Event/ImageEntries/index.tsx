import React, {useState} from 'react'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import StatusSelect from 'organization/Event/ImageEntries/StatusSelect'
import {SectionTitle} from 'organization/Event/Page'
import ImageWaterfallConfig from 'organization/Event/ImageEntries/ImageWaterfallConfig'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {useImageEntries} from 'organization/Event/ImageEntriesProvider'
import ImageEntryCard from 'organization/Event/ImageEntries/ImageEntryCard'
import PageLimitSelect from 'organization/Event/ImageEntries/PageLimitSelect'
import Pagination from 'organization/Event/ImageEntries/Pagination'
import {useToggle} from 'lib/toggle'
import Box from '@material-ui/core/Box'
import SelectedImage from 'Event/ImageWaterfall/SelectedImage'
import {ImageEntry} from 'organization/Event/ImageEntriesProvider'

export default function ImageEntries() {
  const {
    flag: showingWaterfallConfig,
    toggle: toggleWaterfallConfig,
  } = useToggle()

  return (
    <>
      <ImageWaterfallConfig
        isVisible={showingWaterfallConfig}
        onClose={toggleWaterfallConfig}
      />
      <Layout>
        <Page>
          <SectionTitle>Image Entries</SectionTitle>
          <Box mb={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={toggleWaterfallConfig}
            >
              Image Waterfall Settings
            </Button>
          </Box>
          <StatusSelect />
          <Entries />
          <Grid container justify="center">
            <PageLimitSelect />
            <Pagination />
          </Grid>
        </Page>
      </Layout>
    </>
  )
}

function Entries() {
  const {entries} = useImageEntries()

  const [selected, setSelected] = useState<ImageEntry | null>(null)

  const isEmpty = entries.length === 0
  if (isEmpty) {
    return <div>No Image Entries Available</div>
  }

  return (
    <Grid container wrap="wrap">
      {entries.map((entry) => (
        <ImageEntryCard
          key={entry.id}
          entry={entry}
          setSelected={setSelected}
        />
      ))}
      <SelectedImage
        appBarPresent
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </Grid>
  )
}
