import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {routesWithValue} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {Form, useForms} from 'organization/Event/FormsProvider'
import React from 'react'

export default function Forms() {
  const {forms} = useForms()

  const eventRoutes = useEventRoutes()

  const hasForms = forms.length > 0
  if (!hasForms) {
    return <div>No forms have been added</div>
  }

  const formRoute = (form: Form) =>
    routesWithValue(':form', String(form.id), eventRoutes.forms[':form'])

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
