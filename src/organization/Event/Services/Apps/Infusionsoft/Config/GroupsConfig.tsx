import styled from 'styled-components'
import {InfusionsoftGroup} from 'organization/Event/Services/Apps/Infusionsoft'
import React from 'react'
import Button from '@material-ui/core/Button'
import GroupInput from 'organization/Event/Services/Apps/Infusionsoft/Config/GroupInput'

export default function GroupsConfig(props: {
  groups: InfusionsoftGroup[]
  onChange: (groups: InfusionsoftGroup[]) => void
}) {
  const {groups, onChange} = props

  const addGroup = () => {
    const added = [
      ...groups,
      {
        infusionsoft_field_name: '',
        infusionsoft_field_label: '',
        key: '',
      },
    ]

    onChange(added)
  }

  const updateAtIndex = (index: number) => (updated: InfusionsoftGroup) => {
    const list = groups.map((g, i) => {
      const isTarget = i === index

      if (!isTarget) {
        return g
      }

      return updated
    })

    onChange(list)
  }

  const removeAt = (index: number) => () => {
    const removed = groups.filter((g, i) => i !== index)
    onChange(removed)
  }

  return (
    <>
      {groups.map((group, i) => (
        <GroupInput
          key={i}
          group={group}
          onChange={updateAtIndex(i)}
          onRemove={removeAt(i)}
        />
      ))}
      <AddGroupButton
        aria-label="add group"
        variant="outlined"
        color="primary"
        onClick={addGroup}
        fullWidth
        size="large"
      >
        Add Group
      </AddGroupButton>
    </>
  )
}

const AddGroupButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]};
`
