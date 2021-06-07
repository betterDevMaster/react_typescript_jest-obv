import React, {useState} from 'react'
import styled from 'styled-components'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import EditFooterDialog from 'Event/Reports/Footer/EditFooterDialog'
import {
  DEFAULT_FOOTER_BACKGROUND_COLOR,
  DEFAULT_FOOTER_TEXT,
  DEFAULT_FOOTER_TEXT_COLOR,
} from 'Event/Reports/ReportsConfig'
import {useReportsConfig} from 'organization/Event/Reports'
import Content from 'lib/ui/form/TextEditor/Content'

export default function Footer(props: {isPreview: boolean}) {
  const [isEditing, setIsEditing] = useState(false)
  const toggleEditing = () => setIsEditing(!isEditing)
  const {report} = useReportsConfig()
  const footer = report.settings?.footer

  return (
    <>
      <EditFooterDialog visible={isEditing} onClose={toggleEditing} />
      <Container
        color={footer?.textColor || DEFAULT_FOOTER_TEXT_COLOR}
        bgColor={footer?.backgroundColor || DEFAULT_FOOTER_BACKGROUND_COLOR}
      >
        <Content>{footer?.text || DEFAULT_FOOTER_TEXT}</Content>
      </Container>
      <EditFooterButton visible={!props.isPreview} onClick={toggleEditing} />
    </>
  )
}

function EditFooterButton(props: {visible: boolean; onClick: () => void}) {
  if (!props.visible) {
    return null
  }

  return (
    <StyledEditButton
      onClick={props.onClick}
      fullWidth
      size="large"
      variant="outlined"
      color="primary"
      aria-label="edit footer"
    >
      Edit Footer
    </StyledEditButton>
  )
}

const StyledEditButton = withStyles({
  root: {
    marginTop: spacing[6],
  },
})(Button)

const Container = styled.div`
  padding: ${(props) => props.theme.spacing[4]};
  ${(props: {color: string; bgColor: string}) =>
    `color: ${props.color}; background-color: ${props.bgColor}`}
`
