import React from 'react'
import styled from 'styled-components'
import ListViewIcon from 'assets/images/ui/organizations/list.svg'
import GridViewIcon from 'assets/images/ui/organizations/grid.svg'
import {ViewType} from '.'

export type ChangeViewButtonProps = {
  className?: string
  viewType: ViewType
  onClick?: () => void
}

export default function ChangeViewButton(props: ChangeViewButtonProps) {
  const viewTypeIcon = () => {
    if (props.viewType === ViewType.LIST) {
      return GridViewIcon
    }
    return ListViewIcon
  }

  return (
    <StyledButton className={props.className} onClick={props.onClick}>
      <img src={viewTypeIcon()} alt="" />
    </StyledButton>
  )
}

const StyledButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 3px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.gray300};
  }
`
