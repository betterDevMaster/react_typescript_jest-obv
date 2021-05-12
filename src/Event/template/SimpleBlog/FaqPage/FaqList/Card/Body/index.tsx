import React from 'react'
import styled from 'styled-components'
import {FAQ} from 'Event/FaqPage'
import Clickable from 'lib/ui/Editable'
import {useFaqs} from 'organization/Event/FaqsProvider'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import {useVariables} from 'Event'

type BodyProps = {
  faq: FAQ
  isEditMode?: boolean
  className?: string
}

export default function Body(props: BodyProps) {
  if (props.isEditMode) {
    return <Editable {...props} />
  }

  return <FagCard faq={props.faq} />
}

function Editable(props: BodyProps) {
  const {edit} = useFaqs()

  return (
    <>
      <Clickable onClick={() => edit(props.faq)}>
        <FagCard {...props} answerVisible />
      </Clickable>
    </>
  )
}

function FagCard(props: {faq: FAQ; answerVisible?: boolean}) {
  const {faq, answerVisible} = props

  const startExpanded =
    Boolean(props.answerVisible) || Boolean(faq.settings?.showAnswerOnLoad)

  const [expanded, setExpanded] = React.useState(startExpanded)
  const v = useVariables()

  const handleExpandClick = () => {
    if (answerVisible) {
      return
    }

    setExpanded(!expanded)
  }

  return (
    <Clickable
      onClick={() => {
        handleExpandClick()
      }}
    >
      <StyledCard>
        <CardHeader title={v(faq.question)} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div
              dangerouslySetInnerHTML={{
                __html: v(faq.answer),
              }}
            />
          </CardContent>
        </Collapse>
      </StyledCard>
    </Clickable>
  )
}

const StyledCard = styled(Card)`
  background-color: unset !important;
  border-radius: unset !important;
  box-shadow: unset !important;
`
