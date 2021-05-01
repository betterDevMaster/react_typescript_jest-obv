import {Typography} from '@material-ui/core'
import Center from 'lib/ui/layout/Center'
import React from 'react'
import spinner from 'assets/images/obvio_spinner_80.gif'
import styled from 'styled-components'

export default function FullPageLoader() {
  return (
    <Center>
      <div>
        <Spinner src={spinner} alt="loading" />
        <Typography>loading...</Typography>
      </div>
    </Center>
  )
}

const Spinner = styled.img`
  width: 64px;
`
