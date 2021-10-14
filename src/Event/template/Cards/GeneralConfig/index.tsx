import React from 'react'
import LoginConfig from 'Event/template/Cards/Login/LoginConfig'
import SetPasswordFormConfig from 'Event/template/Cards/Step1/SetPasswordFormConfig'
import GlobalStylesConfig from 'Event/template/Cards/GeneralConfig/GlobalStylesConfig'
import OfflineConfig from 'Event/template/Cards/EventOfflinePage/OfflineConfig'
import CheckInConfig from 'Event/template/Cards/GeneralConfig/CheckInConfig'

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
