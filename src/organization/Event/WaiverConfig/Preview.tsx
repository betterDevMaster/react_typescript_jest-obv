import React from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import WaiverProvider from 'Event/Step2/WaiverProvider'
import styled from 'styled-components'
import { useTeamMember } from 'organization/auth'
import { WaiverConfig } from 'Event'
import SimpleBlogStep2 from 'Event/template/SimpleBlog/Step2'

export default function WaiverPreview(props:{body: string, title: string, agreeStatement: string, logo: string}){
    const user = useTeamMember()
    const template = useTemplate()
    const twaiver: WaiverConfig ={
        body: props.body,
        title: props.title,
        agree_statement: props.agreeStatement,
        is_enabled: false,
        logo: props.logo,
        form: null
    }
    switch (template.name) {
        case SIMPLE_BLOG:
            return(
                <PreviewContainer>
                    <WaiverProvider waiver={twaiver} isPreview={true} >
                        <SimpleBlogStep2 user={user} />
                    </WaiverProvider>
                </PreviewContainer>
            )
        default:
          throw new Error(`Missing step 2 for template: ${template.name}`)
      }
}

const PreviewContainer = styled.div`
  padding: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`
