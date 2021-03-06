import React from 'react'
import styled from 'styled-components'
import {LinkProps} from 'lib/ui/link'
import {useLinkStyle} from 'lib/ui/link/style'

type Props = LinkProps & {
  to: string
  download?: boolean
}

export const AbsoluteLink = React.forwardRef(
  (props: Props, ref: React.Ref<any>) => {
    const target = props.newTab ? '_blank' : '_self'
    const rel = props.newTab ? 'noopener noreferrer' : ''

    const style = useLinkStyle(props)

    return (
      <StyledAnchor
        onClick={props.onClick}
        ref={ref}
        href={props.to}
        underline={style.underline}
        color={style.color}
        className={props.className}
        target={target}
        rel={rel}
        aria-label={props['aria-label']}
        disabled={props.disabled}
        download={props.download}
      >
        {props.children}
      </StyledAnchor>
    )
  },
)

const StyledAnchor = styled.a<{
  underline?: boolean
  color: string
  disabled?: boolean
}>`
  font-size: inherit;
  color: ${(props) => props.color};
  &:hover {
    text-decoration: ${(props) =>
      props.underline ? 'underline' : 'none'} !important;
  }
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  opacity: ${(props) => (props.disabled ? 0.8 : 1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`
