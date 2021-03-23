import LoginFieldConfig from 'organization/Event/Services/Apps/Infusionsoft/Config/Step1'
import TagsConfig from 'organization/Event/Services/Apps/Infusionsoft/Config/Step2'
import {useInfusionsoft} from 'organization/Event/Services/ServicesProvider'
import React from 'react'

export default function Config() {
  const infusionsoft = useInfusionsoft()

  if (!infusionsoft.login_field_id) {
    return <LoginFieldConfig />
  }

  return <TagsConfig />
}
