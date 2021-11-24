import React from 'react'
import CardsPage from 'Event/template/Cards/Page'
import {FAQ} from 'Event/FaqPage'
import FaqList from 'Event/template/Cards/Faqs/FaqList'
import {User} from 'auth/user'
import FaqEditDialog from 'Event/template/Cards/Faqs/FaqEditDialog'
import {PageTitle, PageDescription} from 'Event/template/Cards/Page'
import {useAttendeeVariables} from 'Event'
import {useCardsTemplate} from 'Event/template/Cards'
import Content from 'lib/ui/form/TextEditor/Content'

export default function CardsFaqPage(props: {
  user: User
  isEditMode?: boolean
  faqs: FAQ[]
}) {
  const {faqs} = props
  const template = useCardsTemplate()
  const {faq: pageSettings} = template
  const v = useAttendeeVariables()

  const content = (
    <>
      <PageTitle aria-label="faqs title">{v(pageSettings?.title)}</PageTitle>
      <PageDescription>
        <Content aria-label="description">
          {v(pageSettings?.description)}
        </Content>
      </PageDescription>
      <FaqEditDialog isEditMode={props.isEditMode} />
      <FaqList faqs={faqs} isEditMode={props.isEditMode} />
    </>
  )

  if (props.isEditMode) {
    return content
  }

  return <CardsPage user={props.user}>{content}</CardsPage>
}
