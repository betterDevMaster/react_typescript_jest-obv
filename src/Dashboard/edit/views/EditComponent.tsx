import {ComponentType} from 'Dashboard/components'
import {setComponent} from 'Dashboard/edit/state/actions'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

export const EDIT_COMPONENT_CLASS = 'edit-component'
export const EDIT_COMPONENT_BUTTON_CLASS = 'edit-component-button'

export default function EditComponent(props: {
  children: React.ReactElement
  type: ComponentType
  id?: string
  isEditMode: boolean
}) {
  const dispatch = useDispatch()
  const {type, id} = props

  const edit = useCallback(() => {
    dispatch(
      setComponent({
        type,
        id,
      }),
    )
  }, [dispatch, type, id])

  if (props.isEditMode === false) {
    return props.children
  }

  return (
    <Box className={EDIT_COMPONENT_CLASS}>
      <StyledEditIconButton
        onClick={edit}
        className={EDIT_COMPONENT_BUTTON_CLASS}
      />
      {props.children}
    </Box>
  )
}

const StyledEditIconButton = styled(EditIconButton)`
  position: absolute;
  z-index: 2;
  right: ${(props) => props.theme.spacing[1]};
  top: ${(props) => props.theme.spacing[1]};
  display: none;

  &:hover {
    opacity: 0.8;
  }
`

const Box = styled.div`
  position: relative;

  &:hover ${StyledEditIconButton} {
    display: inline-flex;
  }
`
