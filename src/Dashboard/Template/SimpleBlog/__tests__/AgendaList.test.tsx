import React from 'react'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import user from '@testing-library/user-event'

it('should render agendas', async () => {
  const dashboard = fakeSimpleBlog({agendas: []})

  const {queryByText, findAllByLabelText, rerender} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/agenda/i)).not.toBeInTheDocument()

  const agendas = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAgenda,
  )

  const dashboardWithAgendas = fakeSimpleBlog({
    agendas,
  })
  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={dashboardWithAgendas}
      user={fakeUser()}
    />,
  )

  expect((await findAllByLabelText('agenda')).length).toBe(agendas.length)
})

it('should edit an agenda', async () => {
  const agendas = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )

  const dashboard = fakeSimpleBlog({agendas})

  const {findAllByLabelText, findByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  const targetIndex = faker.random.number({min: 0, max: agendas.length - 1})

  // Renders same values as data
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(agendas[targetIndex].text)

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  const updatedText = faker.random.word()

  user.type(await findByLabelText('agenda text'), updatedText)

  fireEvent.click(await findByLabelText('close config dialog'))

  // Has updated text
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(updatedText)
})

it('should add a new agenda', async () => {
  const dashboard = fakeSimpleBlog({agendas: []})

  const {findAllByLabelText, findByLabelText, queryByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText('agenda')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add agenda event'))

  expect((await findAllByLabelText('agenda')).length).toBe(1)
})

it('should remove an agenda', async () => {
  const agendas = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAgenda,
  )

  const dashboard = fakeSimpleBlog({agendas})

  const {queryByText, findAllByLabelText, findByLabelText, findByText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  const targetIndex = faker.random.number({min: 0, max: agendas.length - 1})

  const targetText = agendas[targetIndex].text

  expect(await findByText(targetText)).toBeInTheDocument()

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  fireEvent.click(await findByLabelText('remove agenda'))

  // one less agenda
  expect((await findAllByLabelText('agenda event')).length).toBe(
    agendas.length - 1,
  )

  expect(queryByText(targetText)).not.toBeInTheDocument()
})
