import React from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import SimpleBlogGeneralConfig from 'Event/template/SimpleBlog/GeneralConfig'
import PanelsGeneralConfig from 'Event/template/Panels/GeneralConfig'
import {withStyles} from '@material-ui/core/styles'
import {spacing} from 'lib/ui/theme'
import Typography from '@material-ui/core/Typography'

export default function GeneralConfig() {
  return (
    <Layout>
      <Page>
        <TemplateGeneralConfig />
      </Page>
    </Layout>
  )
}

function TemplateGeneralConfig() {
  const template = useTemplate()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogGeneralConfig />
    case PANELS:
      return <PanelsGeneralConfig />
    default:
      throw new Error('Missing a template')
  }
}

export function SectionTitle(props: {children: string}) {
  return <TitleText variant="h6">{props.children}</TitleText>
}

const TitleText = withStyles({
  root: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
})(Typography)

export const PreviewBox = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
