import React from 'react'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import Page from 'Event/template/NiftyFifty/Page'
import Content from 'Event/template/NiftyFifty/Step1/SetPasswordForm/Content'
import LeftPanel from 'Event/template/NiftyFifty/check-in/LeftPanel'
import MobilePanel from 'Event/template/NiftyFifty/check-in/MobilePanel'
import RightPanel from 'Event/template/NiftyFifty/check-in/RightPanel'

export default function SetPasswordForm(props: SetPasswordFormProps) {
  return (
    <Page
      Left={<LeftPanel user={props.user} />}
      Right={
        <RightPanel center step={1}>
          <Content {...props} />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={1} user={props.user}>
          <Content {...props} />
        </MobilePanel>
      }
    />
  )
}
