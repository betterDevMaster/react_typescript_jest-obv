import styled from 'styled-components'
import React from 'react'
import {Sponsor} from 'Event/SponsorPage'
import {createEntityList} from 'lib/list'
import {useEffect, useState} from 'react'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import NavButton, {NavButtonProps} from 'Event/Dashboard/components/NavButton'
import {v4 as uid} from 'uuid'
import {EditComponentOverlay} from 'Event/Dashboard/editor/views/EditComponent'
import AddButton from 'Event/template/NiftyFifty/Dashboard/Sponsors/SponsorEditDialog/Form/Buttons/AddButton'

type Buttons = NonNullable<NonNullable<Sponsor['settings']>['buttons']>

export default function Buttons(props: {
  buttons: Buttons
  edit: ReturnType<typeof useButtons>['edit']
  onAdd: ReturnType<typeof useButtons>['add']
  duplicate: ReturnType<typeof useButtons>['duplicate']
  loading: ReturnType<typeof useButtons>['loading']
}) {
  const {buttons, edit, onAdd, loading, duplicate} = props

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
      <ButtonList buttons={buttons} edit={edit} duplicate={duplicate} />
    </>
  )
}

function ButtonList(props: {
  buttons: Buttons
  edit: ReturnType<typeof useButtons>['edit']
  duplicate: ReturnType<typeof useButtons>['duplicate']
}) {
  const {buttons, edit, duplicate} = props
  const hasButtons = buttons.ids.length > 0

  if (!hasButtons) {
    return <div>No buttons have been added</div>
  }

  return (
    <>
      {buttons.ids.map((id) => (
        <ButtonBox key={id}>
          <EditComponentOverlay
            onClick={edit(id)}
            disableChildInteraction
            aria-label="edit button"
            onCopy={() => duplicate(id)}
          >
            <NavButton aria-label="sponsor button" {...buttons.entities[id]} />
          </EditComponentOverlay>
        </ButtonBox>
      ))}
    </>
  )
}

export function useButtons(sponsor: Sponsor) {
  const [buttons, setButtons] = useState<Buttons>(createEntityList([]))
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const existing = sponsor.settings?.buttons
    if (existing) {
      setButtons(existing)
    }

    setLoading(false)
  }, [sponsor])

  const add = (button: NavButtonProps) => {
    const id = uid()
    const ids = [...buttons.ids, id]
    const entities = {
      ...buttons.entities,
      [id]: button,
    }

    setButtons({ids, entities})
  }

  const duplicate = (id: string) => {
    const button = buttons.entities[id]
    add(button)
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

  const update = (button: NavButtonProps) => {
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
    duplicate,
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
