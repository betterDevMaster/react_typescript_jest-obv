import React, {useEffect, useState} from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {NameAppendage} from 'organization/Event/NameAppendageConfig/NameAppendageProvider'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import {Button, Table} from '@material-ui/core'
import {api} from 'lib/url'
import '../sorting.css'
import styled from "styled-components";
import {GenerateTextForVisibilityRules} from "organization/Event/NameAppendageConfig/GenerateTextForVisibilityRules";
import {LabelPreview} from "organization/Event/NameAppendageConfig/LabelPreview";

export default function NameAppendageListTable(props: {
  nameAppendages: NameAppendage[]
  setEditing: (nameAppendage: NameAppendage) => void
  setNameAppendages: (nameAppendage: NameAppendage[]) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const {event} = useEvent()
  const {client} = useOrganization()

    if (!props.nameAppendages) {
        return <>Loading ...</>
    }

  const SortableItem = SortableElement((nameAppendage: NameAppendage) => (
    <TableRow aria-label="name appendage">
      <TableCell align="center">{nameAppendage.order}</TableCell>
      <TableCell ><LabelPreview withoutDash={true} text={ nameAppendage.appendage_text } emoji={nameAppendage.appendage_emoji}/></TableCell>
      <TableCell align="center" width={"500px"} > <GenerateTextForVisibilityRules rules={JSON.parse(nameAppendage.rules)} cropText={true} seeMoreCallback={() => props.setEditing(nameAppendage)}/> </TableCell>
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

  const removeNameAppendage = (nameAppendage: NameAppendage) => {
    setSubmitting(true)
    const url = api(
      `/events/${event.slug}/name-appendage/remove/${nameAppendage.id}`,
    )

    client
      .delete(url)
      .then(() => {})
      .finally(() => {
        props.setNameAppendages(
          removeNameAppendageFromList(props.nameAppendages, nameAppendage),
        )
        setSubmitting(false)
      })
  }

  function removeNameAppendageFromList(
    nameAppendagesList: NameAppendage[],
    nameAppendage: NameAppendage,
  ) {
    nameAppendagesList = nameAppendagesList.filter(
      (nameAppendagesList) => nameAppendagesList.id !== nameAppendage.id,
    )
    nameAppendagesList.map((value, index) => {
      nameAppendagesList[index].order = index + 1
    })

    return nameAppendagesList
  }

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


  const onSortEnd = ({oldIndex, newIndex}: any) => {
    if (oldIndex != newIndex) {
      props.setNameAppendages(
        reorderNameAppendage(props.nameAppendages, oldIndex, newIndex),
      )

      setSubmitting(true)
      const url = api(`/events/${event.slug}/name-appendage/sort`)

      client
        .post(url, {nameAppendagesList: props.nameAppendages})
        .then(() => {})
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  return <SortableList {...props} onSortEnd={onSortEnd} distance={10} />
}

function reorderNameAppendage(
  nameAppendages: NameAppendage[],
  oldIndex: any,
  newIndex: any,
) {
  nameAppendages.splice(newIndex, 0, nameAppendages.splice(oldIndex, 1)[0])

  nameAppendages.map((value, index) => {
    nameAppendages[index].order = index + 1
  })

  return nameAppendages
}

const TableBox = styled.div`
  overflow: auto;
`