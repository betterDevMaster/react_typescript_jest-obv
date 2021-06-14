import React from 'react'
import {
  BOLD,
  FontStyle,
  ITALIC,
  UNDERLINE,
} from 'lib/ui/typography/FontStyleInput'
import styled from 'styled-components'
import {useEffect, useState} from 'react'

/**
 * Styled Text is a HOC that accepts fontStyles, and automatically
 * applies the styles to a given Component.
 *
 * @param props
 * @returns
 */
export default function StyledText<T>(
  props: {
    fontStyles?: FontStyle[]
    Component: React.FunctionComponent<T>
  } & T,
) {
  const {fontStyles, Component, ...otherProps} = props
  const [
    StyledComponent,
    setStyledComponent,
  ] = useState<null | React.FunctionComponent>(null)

  /**
   * Style the target Component dynamically. We only want to create new components
   * whenever either the Component, or the fontStyles change. Putting it in a
   * useEffect also prevents styled-component's dynamic component errors.
   */
  useEffect(() => {
    setStyledComponent(
      styled(Component)`
        ${fontStyles?.includes(BOLD) ? 'font-weight: bold;' : ''}
        ${fontStyles?.includes(UNDERLINE) ? 'text-decoration: underline;' : ''}
    ${fontStyles?.includes(ITALIC) ? 'font-style: italic;' : ''}
      `,
    )
  }, [fontStyles, Component])

  if (!StyledComponent) {
    return null
  }

  return <StyledComponent {...otherProps} />
}
