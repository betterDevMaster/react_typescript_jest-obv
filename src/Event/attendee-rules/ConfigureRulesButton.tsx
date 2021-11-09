import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

export default function ConfigureRulesButton(props: {
  onClick: () => void
  buttonText?: string
  className?: string
}) {
  return (
    <Box className={props.className}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={props.onClick}
      >
        {props.buttonText ? props.buttonText : 'Visibility Rules'}
      </Button>
    </Box>
  )
}

const Box = styled.div`
  text-align: right;
`
