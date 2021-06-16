import React from 'react'
import {SetPasswordFormProps} from 'Event/Step1/SetPasswordForm'
import Page from 'Event/template/Panels/Page'
import Content from 'Event/template/Panels/Step1/SetPasswordForm/Content'
import LeftPanel from 'Event/template/Panels/check-in/LeftPanel'
import MobilePanel from 'Event/template/Panels/check-in/MobilePanel'
import RightPanel from 'Event/template/Panels/check-in/RightPanel'

export default function SetPasswordForm(props: SetPasswordFormProps) {
  return (
    <Page
      Left={<LeftPanel step={1} />}
      Right={
        <RightPanel center>
          <Content {...props} />
        </RightPanel>
      }
      Mobile={
        <MobilePanel step={1}>
          <Content {...props} />
        </MobilePanel>
      }
    />
  )
}
