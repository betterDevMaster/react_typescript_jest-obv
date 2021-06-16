import React from 'react'
import ProgressBarConfig from 'Event/template/SimpleBlog/GeneralConfig/ProgressBarConfig'
import LoginConfig from 'Event/template/SimpleBlog/Login/LoginConfig'
import SetPasswordFormConfig from 'Event/template/SimpleBlog/Step1/SetPasswordFormConfig'

export default function GeneralConfig() {
  return (
    <>
      <ProgressBarConfig />
      <LoginConfig />
      <SetPasswordFormConfig />
    </>
  )
}
