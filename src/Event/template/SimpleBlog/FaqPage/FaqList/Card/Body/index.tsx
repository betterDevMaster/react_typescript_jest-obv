import React from 'react'
import {FAQ} from 'Event/FaqPage'
import Clickable from 'lib/ui/Editable'
import {useFaqs} from 'organization/Event/FaqsProvider'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import {useVariables} from 'Event'
import {spacing} from 'lib/ui/theme'
import grey from '@material-ui/core/colors/grey'
import withStyles from '@material-ui/core/styles/withStyles'

type BodyProps = {
  faq: FAQ
  isEditMode?: boolean
  className?: string
}

export default function Body(props: BodyProps) {
  if (props.isEditMode) {
    return <Editable {...props} />
  }

  return <FaqCard faq={props.faq} />
}

function Editable(props: BodyProps) {
  const {edit} = useFaqs()

  return (
    <>
      <Clickable onClick={() => edit(props.faq)}>
        <FaqCard {...props} answerVisible />
      </Clickable>
    </>
  )
}

function FaqCard(props: {faq: FAQ; answerVisible?: boolean}) {
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
    <Box
      onClick={() => {
        handleExpandClick()
      }}
    >
      <StyledCard>
        <StyledCardHeader title={v(faq.question)} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <StyledCardContent>
            <div
              dangerouslySetInnerHTML={{
                __html: v(faq.answer),
              }}
            />
          </StyledCardContent>
        </Collapse>
      </StyledCard>
    </Box>
  )
}

const StyledCard = withStyles({
  root: {
    backgroundColor: 'unset',
    boxShadow: 'unset',
    borderRadius: 'unset',
  },
})(Card)

const StyledCardContent = withStyles({
  root: {
    paddingTop: 0,
    paddingBottom: spacing[2],
    marginBottom: spacing[3],
    borderBottom: `1px solid ${grey[300]};`,
  },
})(CardContent)

const StyledCardHeader = withStyles({
  root: {
    paddingBottom: 0,
    '& :hover': {
      opacity: 0.6,
      cursor: 'pointer',
    },
  },
})(CardHeader)
