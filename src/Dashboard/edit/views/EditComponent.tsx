import {ComponentType} from 'Dashboard/components'
import {setComponent} from 'Dashboard/edit/state/actions'
import EditIconButton from 'lib/ui/IconButton/EditIconButton'
import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import styled from 'styled-components'

export default function EditComponent(props: {
  children: React.ReactElement
  type: ComponentType
  id?: string
  isEditMode?: boolean
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
    <Box>
      <StyledEditIconButton onClick={edit} />
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
