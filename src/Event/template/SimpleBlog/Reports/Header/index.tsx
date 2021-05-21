import React, {useState} from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import {spacing} from 'lib/ui/theme'
import {FileLocation} from 'lib/http-client'
import {
  DEFAULT_TITLE,
  DEFAULT_TITLE_COLOR,
} from 'Event/template/SimpleBlog/Reports/ReportsConfig'
import EditHeaderDialog from 'Event/template/SimpleBlog/Reports/Header/EditHeaderDialog'
import {useReportsConfig} from 'organization/Event/ReportsConfig'

export default function Header(props: {isPreview: boolean}) {
  const [editing, setEditing] = useState(false)
  const toggleEditing = () => setEditing(!editing)
  const {report} = useReportsConfig()
  const header = report.settings?.header

  return (
    <>
      <EditHeaderDialog visible={editing} onClose={toggleEditing} />
      <Container image={report.header_background}>
        <Title aria-label="title" color={header?.color || DEFAULT_TITLE_COLOR}>
          {header?.title || DEFAULT_TITLE}
        </Title>
      </Container>
      <EditHeaderButton visible={!props.isPreview} onClick={toggleEditing} />
    </>
  )
}

function EditHeaderButton(props: {visible: boolean; onClick: () => void}) {
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
      aria-label="edit header"
    >
      Edit Header
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
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  ${(props: {image: FileLocation | null}) =>
    props.image &&
    props.image.url &&
    `background-image: url(${props.image.url})`}
`

const Title = styled.h2`
  ${(props: {color: string}) => `color: ${props.color};`}
  font-size: 42px;
  line-height: 1.5;
  text-transform: uppercase;
  text-align: center;
`
