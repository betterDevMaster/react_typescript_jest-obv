import Table from '@material-ui/core/Table'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {routesWithValue} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {Form, useForms} from 'organization/Event/FormsProvider'
import React from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import styled from 'styled-components'
import {useToggle} from 'lib/toggle'
import IconButton from '@material-ui/core/IconButton'

export default function Forms() {
  const {forms, add} = useForms()
  const duplicate = useDuplicate()
  const {flag: processing, toggle: toggleProcessing} = useToggle()

  const eventRoutes = useEventRoutes()

  const hasForms = forms.length > 0
  if (!hasForms) {
    return <div>No forms have been added</div>
  }

  const formRoute = (form: Form) =>
    routesWithValue(':form', String(form.id), eventRoutes.forms[':form'])

  const handleDuplicate = (form: Form) => {
    if (processing) {
      return
    }

    toggleProcessing()
    duplicate(form).then(add).finally(toggleProcessing)
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id} aria-label="form">
            <TableCell>
              <RelativeLink key={form.id} to={formRoute(form).root}>
                {form.name}
              </RelativeLink>
            </TableCell>
            <ActionTableCell>
              <IconButton
                onClick={() => handleDuplicate(form)}
                disabled={processing}
                size="small"
                color="primary"
                aria-label="duplicate form"
              >
                <StyledFileCopyIcon />
              </IconButton>
            </ActionTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function useDuplicate() {
  const {client} = useOrganization()
  return (form: Form) => {
    const url = api(`/forms/${form.id}/duplicate`)
    return client.post<Form>(url)
  }
}

const ActionTableCell = styled(TableCell)`
  width: 10%;
`

const StyledFileCopyIcon = styled(FileCopyIcon)`
  font-size: 20px !important;
`
