import React from 'react'
import {Rule} from 'Event/attendee-rules'
import CustomButton from 'lib/ui/Button/CustomButton'

export function GenerateTextForVisibilityRules(props: {
  rules: Rule[]
  cropText?: boolean
  seeMoreCallback?: () => void
}) {
  let generatedText = ''
  let first = true

  if (props.rules.length) {
    props.rules.map((value: any, index: number) => {
      if (!first) {
        generatedText += value.condition + ' '
      } else {
        first = false
      }

      if (value.source === 'Nested Rule') {
        generatedText +=
          value.source + ' with ' + value.rules.length + ' rules '
      } else {
        generatedText += value.source + ' '
        generatedText += value.type + ' '
        generatedText += value.target + ' '
      }

      return null
    })

    generatedText =
      generatedText.charAt(0) + generatedText.substring(1).toLowerCase()
  } else {
    generatedText = 'No rules'
  }

  if (props.cropText === true && generatedText.length > 110) {
    return (
      <>
        <span>{generatedText.substring(0, 110)} ... </span>
        <CustomButton variant="text" onClick={props.seeMoreCallback}>
          (See more)
        </CustomButton>
      </>
    )
  }

  return <span>{generatedText}</span>
}
