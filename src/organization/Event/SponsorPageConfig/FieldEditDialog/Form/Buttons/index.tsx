import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event'
import {createEntityList} from 'lib/list'
import {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import NavButton from 'Event/Dashboard/components/NavButton'
import {v4 as uid} from 'uuid'
import {EditComponentOverlay} from 'Event/Dashboard/editor/views/EditComponent'
import AddButton from 'organization/Event/SponsorPageConfig/FieldEditDialog/Form/Buttons/AddButton'

export default function Buttons(props: {
  buttons: NonNullable<Sponsor['buttons']>
  edit: ReturnType<typeof useButtons>['edit']
  onAdd: ReturnType<typeof useButtons>['add']
  loading: ReturnType<typeof useButtons>['loading']
}) {
  const {buttons, edit, onAdd, loading} = props

  if (loading) {
    return null
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <InputLabel>Buttons</InputLabel>
        <AddButton onAdd={onAdd} />
      </Box>
      <ButtonList buttons={buttons} edit={edit} />
    </>
  )
}

function ButtonList(props: {
  buttons: NonNullable<Sponsor['buttons']>
  edit: ReturnType<typeof useButtons>['edit']
}) {
  const {buttons, edit} = props
  const hasButtons = buttons.ids.length > 0

  if (!hasButtons) {
    return <div>No buttons have been added</div>
  }

  return (
    <>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <EditComponentOverlay onClick={edit(id)} disableChildInteraction>
            <NavButton aria-label="sponsor button" {...buttons.entities[id]} />
          </EditComponentOverlay>
        </ButtonBox>
      ))}
    </>
  )
}

export function useButtons(sponsor: Sponsor) {
  const [buttons, setButtons] = useState<NonNullable<Sponsor['buttons']>>(
    createEntityList([]),
  )
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (sponsor.buttons) {
      setButtons(sponsor.buttons)
    }

    setLoading(false)
  }, [sponsor])

  const add = (button: NavButton) => {
    const id = uid()
    const ids = [...buttons.ids, id]
    const entities = {
      ...buttons.entities,
      [id]: button,
    }

    setButtons({ids, entities})
  }

  const edit = (id: string | null) => () => setEditingId(id)

  const stopEdit = () => setEditingId(null)

  const editing = editingId ? buttons.entities[editingId] : null

  const remove = () => {
    if (!editingId) {
      return
    }

    const {[editingId]: target, ...otherEntities} = buttons.entities
    const otherIds = buttons.ids.filter((i) => i !== editingId)

    setButtons({ids: otherIds, entities: otherEntities})
    stopEdit()
  }

  const update = (button: NavButton) => {
    if (!editingId) {
      throw new Error(
        `'editingId' not set; was update called outside of ButtonConfig?`,
      )
    }

    const updated = {
      ...buttons.entities,
      [editingId]: button,
    }

    setButtons({
      ...buttons,
      entities: updated,
    })
  }

  return {
    loading,
    buttons,
    add,
    editing,
    edit,
    remove,
    update,
    stopEdit,
  }
}

const ButtonBox = styled.div`
  &:not(:last-child) {
    margin-bottom: ${(props) => props.theme.spacing[1]};
  }
`
