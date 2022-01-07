import React from 'react'
import styled from 'styled-components'

import {useTheme, useMediaQuery} from '@material-ui/core'

import {useAttendeeVariables} from 'Event'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {ImageMasonryWall, useFetchEntries} from 'Event/ImageWaterfall'
import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import {PageDescription, PageTitle} from 'Event/template/NiftyFifty/Page'
import NiftyFiftyImageWaterfallConfig from 'Event/template/NiftyFifty/Dashboard/ImageWaterfall/ImageWaterfallConfig'

import {useToggle} from 'lib/toggle'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import TextContent from 'lib/ui/form/TextEditor/Content'

import ComponentConfig from 'organization/Event/DashboardConfig/ComponentConfig'

export default function NiftyFiftyImageWaterfall() {
  const {loading, entries} = useFetchEntries()
  const {imageWaterfall: pageSettings} = useNiftyFiftyTemplate()
  const v = useAttendeeVariables()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()
  const theme = useTheme()
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'))

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <Paper isXSMobile={isXSMobile}>
      <ComponentConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        title="Image Waterfall"
      >
        <NiftyFiftyImageWaterfallConfig onClose={toggleConfig} />
      </ComponentConfig>
      <Editable onEdit={toggleConfig}>
        <PageTitle>{v(pageSettings.title)}</PageTitle>
      </Editable>
      <PageDescription>
        <TextContent>{v(pageSettings?.description)}</TextContent>
      </PageDescription>
      <ImageMasonryWall entries={entries} />
    </Paper>
  )
}

const Paper = styled.div<{
  isXSMobile: boolean
}>`
  padding: 0
    ${(props) =>
      props.isXSMobile ? props.theme.spacing[8] : props.theme.spacing[12]};
`
