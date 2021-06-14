import React from 'react'
import faker from 'faker'
import {fireEvent, wait} from '@testing-library/react'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {emptyActions, render} from '__utils__/render'
import {fakeAgenda} from 'Event/template/SimpleBlog/Dashboard/AgendaList/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {defaultScore} from 'Event/PointsProvider'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should edit an agenda', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const title = faker.random.word()
  const dashboard = fakeSimpleBlog({agenda: {title, items: list}})
  const event = fakeEvent({template: dashboard})

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const targetIndex = faker.random.number({min: 0, max: list.length - 1})

  // Renders same values as data
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(list[targetIndex].text)

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  const updatedText = faker.random.word()

  user.type(await findByLabelText('agenda text'), updatedText)

  fireEvent.click(await findByLabelText('close config dialog'))

  // Has updated text
  expect(
    (await findAllByLabelText('agenda event'))[targetIndex].textContent,
  ).toBe(updatedText)

  // Saved
  await wait(() => {
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agenda.items[targetIndex].text).toBe(updatedText)
})

it('should add a new agenda', async () => {
  const title = faker.random.word()
  const dashboard = fakeSimpleBlog({agenda: {title, items: []}})
  const event = fakeEvent({template: dashboard})

  const {
    findAllByLabelText,
    findByLabelText,
    queryByLabelText,
  } = await goToDashboardConfig({event})

  expect(queryByLabelText('agenda')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add agenda event'))

  expect((await findAllByLabelText('agenda')).length).toBe(1)

  // Saved
  await wait(() => {
    expect(mockRxJsAjax.post).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agenda.items.length).toBe(1)
})

it('should remove an agenda', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const title = faker.random.word()
  const dashboard = fakeSimpleBlog({agenda: {title, items: list}})
  const event = fakeEvent({template: dashboard})

  const {
    queryByText,
    findAllByLabelText,
    findByLabelText,
    findByText,
  } = await goToDashboardConfig({event})

  const targetIndex = faker.random.number({min: 0, max: list.length - 1})

  const targetText = list[targetIndex].text

  expect(await findByText(targetText)).toBeInTheDocument()

  clickEdit((await findAllByLabelText('agenda'))[targetIndex])

  fireEvent.click(await findByLabelText('remove agenda'))

  // one less agenda
  expect((await findAllByLabelText('agenda event')).length).toBe(
    list.length - 1,
  )

  expect(queryByText(targetText)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.agenda.items.length).toBe(list.length - 1)
})

it('should update agendas list title', async () => {
  const list = Array.from(
    {length: faker.random.number({min: 2, max: 4})},
    fakeAgenda,
  )
  const title = faker.random.word()
  const dashboard = fakeSimpleBlog({agenda: {title, items: list}})
  const event = fakeEvent({template: dashboard})

  const {findByLabelText} = await goToDashboardConfig({event})

  clickEdit(await findByLabelText('agendas'))
  const upadtedTitle = faker.random.words(2)

  user.type(await findByLabelText('update agendas title'), upadtedTitle)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect((await findByLabelText('agendas')).textContent).toBe(upadtedTitle)
})
