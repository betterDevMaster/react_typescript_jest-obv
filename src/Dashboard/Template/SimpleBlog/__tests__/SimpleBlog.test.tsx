import React from 'react'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Dashboard/Template/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {setWindowMatchMedia} from '__utils__/media-query'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {fakeResource} from 'Dashboard/components/ResourceList/__utils__/factory'
import {fakeNavButton} from 'Dashboard/components/NavButton/__utils__/factory'
import {fakeBlogPost} from 'Dashboard/components/BlogPost/__utils__/factory'
import {ALL_TICKET_RIBBONS} from 'Dashboard/components/TicketRibbon'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import userEvent from '@testing-library/user-event'

beforeAll(() => {
  // Required to render <Hidden/> components in tests
  setWindowMatchMedia()
})

it('should update the logo', async () => {
  const dashboard = fakeSimpleBlog()
  const {findByLabelText} = render(
    <Dashboard isEditMode={true} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    dashboard.logo,
  )

  clickEdit(await findByLabelText('header'))

  const newUrl = faker.internet.url()
  userEvent.type(await findByLabelText('edit logo'), newUrl)

  fireEvent.click(await findByLabelText('close config dialog'))

  expect(((await findByLabelText('logo')) as HTMLImageElement).src).toBe(
    `${newUrl}/`,
  )
})

it('should show the user email', async () => {
  const user = fakeUser()
  const {findByText, findByTestId} = render(
    <Dashboard isEditMode={false} dashboard={fakeSimpleBlog()} user={user} />,
  )

  const menuButton = await findByTestId('menu-button')
  fireEvent.click(menuButton)
  expect(await findByText(new RegExp(user.email))).toBeInTheDocument()
})

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

it('should render points', async () => {
  const dashboard = fakeSimpleBlog({points: null})

  const {queryByText, rerender, findByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints()
  const dashboardWithPoints = fakeSimpleBlog({
    points,
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={dashboardWithPoints}
      user={fakeUser()}
    />,
  )

  const pointsText = new RegExp(
    `you've earned ${points.numPoints} ${points.unit}!`,
    'i',
  )

  expect(await findByText(pointsText)).toBeInTheDocument()
})

it('should render resources', async () => {
  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [],
    },
  })

  const {queryByText, rerender, findAllByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/resources:/i)).not.toBeInTheDocument()

  const numResources = faker.random.number({min: 1, max: 6})
  const withResources = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: Array.from({length: numResources}, fakeResource),
    },
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withResources}
      user={fakeUser()}
    />,
  )

  const resources = await findAllByLabelText('event resource')
  expect(resources.length).toBe(numResources)
})

it('should render ticket ribbons', () => {
  const dashboard = fakeSimpleBlog({
    ticketRibbon: null,
  })

  const ticketRibbon = faker.random.arrayElement(ALL_TICKET_RIBBONS)

  const {queryByLabelText, rerender} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  const label = `${ticketRibbon.name} ticket`

  expect(queryByLabelText(new RegExp(label))).not.toBeInTheDocument()

  const withTicketRibbon = fakeSimpleBlog({
    ticketRibbon,
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withTicketRibbon}
      user={fakeUser()}
    />,
  )

  expect(queryByLabelText(new RegExp(label))).toBeInTheDocument()
})

it('should render sidebarNavButtons', () => {
  const dashboard = fakeSimpleBlog({
    sidebarNavButtons: createEntityList([]),
  })

  const {queryByLabelText, rerender, queryAllByLabelText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/sidebar nav/i)).not.toBeInTheDocument()

  const numButtons = faker.random.number({min: 1, max: 5})

  const withNavButtons = fakeSimpleBlog({
    sidebarNavButtons: createEntityList(
      Array.from({length: numButtons}, fakeNavButton),
    ),
  })

  rerender(
    <Dashboard
      isEditMode={false}
      dashboard={withNavButtons}
      user={fakeUser()}
    />,
  )

  expect(queryAllByLabelText(/sidebar nav/i).length).toBe(numButtons)
})

it('should render a footer', () => {
  const dashboard = fakeSimpleBlog({
    footerBackground: '#000000',
    footerTextColor: '#FFFFFF',
    footerTermsLink: null,
    footerPrivacyLink: null,
    footerCopyrightText: null,
  })

  const {queryByLabelText, rerender, getByText} = render(
    <Dashboard isEditMode={false} dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).not.toBeInTheDocument()

  const copyrightText = faker.lorem.sentence()

  const withFooter = fakeSimpleBlog({
    footerBackground: '#000000',
    footerTextColor: '#FFFFFF',
    footerTermsLink: faker.internet.url(),
    footerPrivacyLink: faker.internet.url(),
    footerCopyrightText: copyrightText,
  })

  rerender(
    <Dashboard isEditMode={false} dashboard={withFooter} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).toBeInTheDocument()

  expect(getByText(new RegExp(copyrightText))).toBeInTheDocument()
})

it('should render blog posts', () => {
  const withoutPosts = fakeSimpleBlog({
    blogPosts: createEntityList([]),
  })

  const {queryByLabelText, rerender, getAllByLabelText, getByText} = render(
    <Dashboard isEditMode={false} dashboard={withoutPosts} user={fakeUser()} />,
  )

  expect(queryByLabelText('blog post')).not.toBeInTheDocument()

  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = createEntityList(
    Array.from({length: numPosts}, fakeBlogPost),
  )

  const withPosts = fakeSimpleBlog({
    blogPosts,
  })

  rerender(
    <Dashboard isEditMode={false} dashboard={withPosts} user={fakeUser()} />,
  )

  expect(getAllByLabelText('blog post').length).toBe(numPosts)

  for (const post of Object.values(blogPosts.entities)) {
    expect(getByText(post.title)).toBeInTheDocument()
  }
})
