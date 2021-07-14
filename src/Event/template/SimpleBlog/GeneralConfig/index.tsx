import React from 'react'
import ProgressBarConfig from 'Event/template/SimpleBlog/GeneralConfig/ProgressBarConfig'
import LoginConfig from 'Event/template/SimpleBlog/Login/LoginConfig'
import SetPasswordFormConfig from 'Event/template/SimpleBlog/Step1/SetPasswordFormConfig'
import GlobalStylesConfig from 'Event/template/SimpleBlog/GeneralConfig/GlobalStylesConfig'
import OfflineConfig from 'Event/template/SimpleBlog/EventOfflinePage/OfflineConfig'

export default function GeneralConfig() {
  return (
    <>
      <ProgressBarConfig />
      <GlobalStylesConfig />
      <LoginConfig />
      <SetPasswordFormConfig />
      <OfflineConfig />
    </>
  )
}
