import React from 'react'
import styled from 'styled-components'

type TypographyProps = {
  fontWeight?: number | string
  fontSize?: number
  lineHeight?: number
  color?: string
  children: React.ReactNode | string
}

export const Title = styled.h1<TypographyProps>`
  font-weight: bold;
  font-size: 36px;
  line-height: 43px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const Header = styled.h2<TypographyProps>`
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const SubHead = styled.h3<TypographyProps>`
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const TableHeader = styled.h4<TypographyProps>`
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const Label = styled.span<TypographyProps>`
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const MenuItemLabel = styled.span<TypographyProps>`
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => (props.color ? props.color : '#4f4f4f')};
`

export const Tiny = styled.span<TypographyProps>`
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => (props.color ? props.color : '#2794d2')};
`

export const Description = styled.p<TypographyProps>`
  font-weight: 300;
  font-size: 14px;
  line-height: 17px;
  color: ${(props) => (props.color ? props.color : '#939393')};
`

export const Text = styled.p<TypographyProps>`
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: ${(props) => (props.color ? props.color : '#000000')};
`

export const Typography = styled.p<TypographyProps>`
  font-weight: ${(props) => props.fontWeight || 'unset'};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : 'unset')};
  line-height: ${(props) =>
    props.lineHeight ? `${props.lineHeight}px` : 'unset'};
  color: ${(props) => props.color || 'unset'};
`
export const ErrorMessage = styled(Typography)<TypographyProps>`
  font-weight: normal !important;
  font-size: 12px !important;
  line-height: 16px !important;
  color: #f44336;
`
