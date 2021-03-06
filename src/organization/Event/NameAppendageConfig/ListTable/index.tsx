import React, {useState} from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {
  NameAppendage,
  useNameAppendages,
} from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import {api} from 'lib/url'
import 'organization/Event/NameAppendageConfig/sorting.css'
import styled from 'styled-components'
import {GenerateTextForVisibilityRules} from 'organization/Event/NameAppendageConfig/Helpers/GenerateTextForVisibilityRules'
import {LabelPreview} from 'organization/Event/NameAppendageConfig/Helpers/LabelPreview'

export default function NameAppendageListTable(props: {
  setEditing: (nameAppendage: NameAppendage) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const {event} = useEvent()
  const {client} = useOrganization()

  const {nameAppendages, remove, reorder} = useNameAppendages()

  const removeNameAppendage = (nameAppendage: NameAppendage) => {
    setSubmitting(true)
    const url = api(`/attendee_labels/${nameAppendage.id}`)

    client
      .delete(url)
      .then(() => {})
      .finally(() => {
        remove(nameAppendage)
        setSubmitting(false)
      })
  }

  const onSortEnd = ({oldIndex, newIndex}: any) => {
    if (oldIndex !== newIndex) {
      reorder(reorderNameAppendage(nameAppendages, oldIndex, newIndex))

      setSubmitting(true)
      const url = api(`/events/${event.slug}/attendee_labels`)

      client.patch(url, {labels: nameAppendages}).finally(() => {
        setSubmitting(false)
      })
    }
  }

  if (!nameAppendages) {
    return <>Loading ...</>
  }

  const SortableItem = SortableElement((nameAppendage: NameAppendage) => (
    <TableRow aria-label="name appendage">
      <TableCell align="center">{nameAppendage.priority}</TableCell>
      <TableCell>
        <LabelPreview
          withoutDash={true}
          text={nameAppendage.text}
          emoji={nameAppendage.emoji}
        />
      </TableCell>
      <TableCell align="center" width={'500px'}>
        {' '}
        <GenerateTextForVisibilityRules
          rules={nameAppendage.rules}
          cropText={true}
          seeMoreCallback={() => props.setEditing(nameAppendage)}
        />{' '}
      </TableCell>
      <TableCell align="center">
        <Button
          fullWidth
          variant="outlined"
          aria-label="update name appendage"
          disabled={submitting}
          onClick={() => {
            props.setEditing(nameAppendage)
          }}
        >
          UPDATE
        </Button>
      </TableCell>
      <TableCell align="center">
        <DangerButton
          fullWidth
          variant="outlined"
          aria-label="remove name appendage"
          disabled={submitting}
          onClick={() => {
            removeNameAppendage(nameAppendage)
          }}
        >
          REMOVE
        </DangerButton>
      </TableCell>
    </TableRow>
  ))

  const SortableList = SortableContainer(
    (props: {nameAppendages: NameAppendage[]}) => {
      return (
        <>
          <TableBox>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Priority</TableCell>

                  <TableCell align="center">Label</TableCell>
                  <TableCell align="center">Visibility Rules</TableCell>
                  <TableCell align="center">{/* Actions */}</TableCell>
                  <TableCell align="center">{/* Actions */}</TableCell>
                </TableRow>
                {props.nameAppendages.map((value, index) => (
                  <SortableItem
                    key={`item-${value.id}`}
                    index={index}
                    {...value}
                  />
                ))}
              </TableHead>
            </Table>
          </TableBox>
        </>
      )
    },
  )

  return (
    <SortableList
      nameAppendages={nameAppendages}
      onSortEnd={onSortEnd}
      distance={10}
    />
  )
}

function reorderNameAppendage(
  nameAppendages: NameAppendage[],
  oldIndex: any,
  newIndex: any,
) {
  nameAppendages.splice(newIndex, 0, nameAppendages.splice(oldIndex, 1)[0])
  nameAppendages.map((_, index) => {
    return (nameAppendages[index].priority = index + 1)
  })

  return nameAppendages
}

const TableBox = styled.div`
  overflow: auto;
`
