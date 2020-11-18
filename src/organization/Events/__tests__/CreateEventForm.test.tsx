import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import {organizationTokenKey} from 'organization/auth'
import faker from 'faker'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {fakeUser} from 'auth/user/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import React from 'react'
import App from 'App'
import {render} from '__utils__/render'
import {act} from '@testing-library/react'
import user from '@testing-library/user-event'

const mockUseLocation = useLocation as jest.Mock
const mockGet = axios.get as jest.Mock
const mockPost = axios.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('it should create a new event', async () => {
  const organization = fakeOrganization()
  const token = faker.random.alphaNumeric(8)
  window.localStorage.setItem(organizationTokenKey(organization.slug), token)
  mockUseLocation.mockImplementationOnce(() => ({
    pathname: `/organization/${organization.slug}`,
  }))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: organization}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: fakeUser()}))
  mockGet.mockImplementationOnce(() => Promise.resolve({data: []}))

  const event = fakeEvent()
  mockPost.mockImplementationOnce(() => Promise.resolve({data: event}))

  mockGet.mockImplementationOnce(() => Promise.resolve({data: [event]}))

  const {findByText, findByLabelText} = render(<App />)

  user.click(await findByText('Create Event'))

  const name = faker.company.companyName()
  const slug = faker.internet.domainWord()

  await act(async () => {
    user.type(await findByLabelText('event name'), name)
    user.type(await findByLabelText('domain slug'), slug)
    user.click(await findByLabelText('create'))
  })

  // Back to events page
  expect(await findByText('Create')).toBeInTheDocument()
  expect(await findByText(event.name)).toBeInTheDocument()
})
