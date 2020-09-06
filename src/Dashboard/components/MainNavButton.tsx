import React from 'react'
import Button from 'ui/button/Button'
import {Column} from 'ui/layout'

export default interface MainNavButton {
  text: string
  link: string
  backgroundColor?: string
  textColor?: string
  size?: Column
}

type Props = Omit<MainNavButton, 'size'>

export default function MainNavButton(props: Props) {
  return <Button fullWidth>{props.text}</Button>
}
