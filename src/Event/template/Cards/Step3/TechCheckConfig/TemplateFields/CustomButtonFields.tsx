import React from 'react'
import {TemplateFieldProps} from 'Event/template/Cards/Step3/TechCheckConfig/TemplateFields'
import {createEntityList} from 'lib/list'
import CustomButtons from 'Event/Step3/CustomButtons'

export default function CustomButtonFields(
  props: TemplateFieldProps & {
    isEditMode?: boolean
    className?: string
  },
) {
  const {techCheck, set} = props
  const buttons = techCheck.buttons || createEntityList([])

  return <CustomButtons buttons={buttons} update={set('buttons')} />
}
