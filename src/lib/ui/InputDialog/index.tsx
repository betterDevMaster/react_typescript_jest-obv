import React from 'react'
import styled from 'styled-components'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(
  ({breakpoints}) => ({
    paper: {
      borderRadius: 3,
      margin: 24,
      width: '100%',
      maxWidth: '640px',
      [breakpoints.down('xs')]: {
        margin: 20,
      },
    },
  }),
  {index: 1},
)

export type InputDialogProps = {
  open: boolean
  title: string
  children: JSX.Element
  onClose: () => void
  onCancel: () => void
  onSave: () => void
}

export default function InputDialog(props: InputDialogProps) {
  const classes = useStyles()
  const {open, title, children, onCancel, onSave, onClose} = props

  return (
    <Dialog open={open} onClose={onClose} classes={{paper: classes.paper}}>
      <Container>
        <TopContainer
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Title>{title}</Title>
          <StyledIconButton onClick={onClose}>
            <StyledCloseIcon />
          </StyledIconButton>
        </TopContainer>
        <Content>{children}</Content>
        <BottomContainer display="flex" flexDirection="row" gridGap="20px">
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <SaveButton onClick={onSave}>Save Changes</SaveButton>
        </BottomContainer>
      </Container>
    </Dialog>
  )
}

const Container = styled(Box)`
  background-color: #222222;
  min-width: 640px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    min-width: unset;
  }
`

const TopContainer = styled(Box)`
  border-bottom: 1px solid #353535;
  padding-top: 20px;
  padding-bottom: 20px;
  padding: 24px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 20px;
  }
`

const Title = styled(Typography)`
  font-weight: 500 !important;
  font-size: 20px !important;
  line-height: 24px !important;
  color: #ffffff;
`

const StyledIconButton = styled(IconButton)`
  padding: 0 0 !important;
`

const StyledCloseIcon = styled(CloseIcon)`
  color: #ffffff;
`

const Content = styled(Box)`
  padding: 24px;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 20px;
  }
`

const BottomContainer = styled(Box)`
  border-top: 1px solid #353535;
  padding: 24px;
  justify-content: flex-end;
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 20px;
    justify-content: space-between;
  }
`

const SaveButton = styled(Button)`
  height: 40px;
  padding: 12px 22px !important;
  border-radius: 3px !important;
  background-color: #20a746 !important;
  color: #ffffff !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  text-transform: unset !important;
`

const CancelButton = styled(Button)`
  height: 40px;
  padding: 12px 22px !important;
  border: 1px solid #353535 !important;
  color: #939393 !important;
  border-radius: 3px !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px !important;
  text-transform: unset !important;
`
