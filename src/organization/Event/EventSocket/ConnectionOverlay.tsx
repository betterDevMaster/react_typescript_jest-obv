import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {AbsoluteLink} from 'lib/ui/link/AbsoluteLink'
import React from 'react'
import styled from 'styled-components'
import logo from 'assets/images/logo_vertical.png'

export default function ConnectionOverlay(props: {
  isConnected: boolean
  isBusy: boolean
  connect: () => void
  children: React.ReactElement
}) {
  const {isConnected, children, connect, isBusy} = props

  if (isConnected) {
    return children
  }

  const refreshPage = () => window.location.reload()

  return (
    <Box>
      <Overlay>
        <div>
          <LogoBox>
            <img src={logo} alt="obv.io" />
          </LogoBox>
          <Typography variant="h5" align="center">
            Session Disconnected
          </Typography>
          <div>
            <Typography align="center">
              Please click the button below to try reconnect
            </Typography>
          </div>
          <ButtonBox>
            <Button variant="outlined" onClick={connect} disabled={isBusy}>
              Connect
            </Button>
          </ButtonBox>
          <CaptionBox>
            <Typography variant="caption" align="center">
              or click{' '}
              <AbsoluteLink to="#" onClick={refreshPage}>
                here
              </AbsoluteLink>{' '}
              to refresh the page.
            </Typography>
          </CaptionBox>
        </div>
      </Overlay>
    </Box>
  )
}

const Box = styled.div`
  position: relative;
`

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  img {
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  height: 100%;
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ButtonBox = styled.div`
  text-align: center;
  margin-top: ${(props) => props.theme.spacing[2]};
`

const CaptionBox = styled.div`
  text-align: center;
`
