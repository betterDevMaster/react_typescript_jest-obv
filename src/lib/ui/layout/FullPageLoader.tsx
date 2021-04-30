import {Typography} from '@material-ui/core'
import Center from 'lib/ui/layout/Center'
import React from 'react'
import spinner from 'assets/images/obvio_spinner_64.gif'

export default function FullPageLoader() {
  return (
    <Center>
      <div>
        <img src={spinner} alt="loading" />
        <Typography>loading...</Typography>
      </div>
    </Center>
  )
}
