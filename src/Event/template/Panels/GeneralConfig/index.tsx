import React from 'react'
import LoginConfig from 'Event/template/Panels/Login/LoginConfig'
import SetPasswordFormConfig from 'Event/template/Panels/Step1/SetPasswordFormConfig'
import GlobalStylesConfig from 'Event/template/Panels/GeneralConfig/GlobalStylesConfig'
import CheckInConfig from 'Event/template/Panels/GeneralConfig/CheckInConfig'
import OfflineConfig from 'Event/template/Panels/EventOfflinePage/OfflineConfig'

export default function GeneralConfig() {
  return (
    <>
      <GlobalStylesConfig />
      <LoginConfig />
      <CheckInConfig />
      <SetPasswordFormConfig />
      <OfflineConfig />
    </>
  )
}
