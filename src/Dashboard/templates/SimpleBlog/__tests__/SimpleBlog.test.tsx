import React from 'react'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {setWindowMatchMedia} from '__utils__/media-query'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {ALL_EMOJIS} from 'Dashboard/components/EmojiList/emoji'
import {fakePoints} from 'Dashboard/components/PointsSummary/__utils__/factory'
import {fakeResource} from 'Dashboard/components/ResourceList/__utils__/factory'
import {fakeTicketRibbon} from 'Dashboard/components/TicketRibbon/__utils__/factory'
import {
  fakeNavButtonWithSize,
  fakeNavButton,
} from 'Dashboard/components/NavButton/__utils__/factory'
import {fakeBlogPost} from 'Dashboard/components/BlogPost/__utils__/factory'

beforeAll(() => {
  // Required to render <Hidden/> components
  setWindowMatchMedia()
})

it('should show the welcome text', async () => {
  const dashboard = fakeSimpleBlog()
  const {findByText} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )
  expect(await findByText(dashboard.welcomeText)).toBeInTheDocument()
})

it('should show the user email', async () => {
  const user = fakeUser()
  const {findByText, findByTestId} = render(
    <Dashboard dashboard={fakeSimpleBlog()} user={user} />,
  )

  const menuButton = await findByTestId('menu-button')
  fireEvent.click(menuButton)
  expect(await findByText(new RegExp(user.email))).toBeInTheDocument()
})

it('should render main nav buttons', async () => {
  const mainNavButtons = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeNavButtonWithSize,
  )

  const {findAllByLabelText} = render(
    <Dashboard
      dashboard={fakeSimpleBlog({
        mainNavButtons,
      })}
      user={fakeUser()}
    />,
  )

  const buttons = await findAllByLabelText('main nav button')
  expect(buttons.length).toBe(mainNavButtons.length)
})

it('should render emojis', async () => {
  const emojis = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => faker.random.arrayElement(ALL_EMOJIS),
  )

  const {findAllByLabelText} = render(
    <Dashboard
      dashboard={fakeSimpleBlog({
        emojis,
      })}
      user={fakeUser()}
    />,
  )

  const emojiEl = await findAllByLabelText('event emoji')
  expect(emojiEl.length).toBe(emojis.length)
})

it('should render agendas', async () => {
  const dashboard = fakeSimpleBlog({agendas: []})

  const {queryByText, findAllByLabelText, rerender} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/agenda/i)).not.toBeInTheDocument()

  const agendas = Array.from(
    {length: faker.random.number({min: 1, max: 4})},
    fakeAgenda,
  )

  const dashboardWithAgendas = fakeSimpleBlog({
    agendas,
  })
  rerender(<Dashboard dashboard={dashboardWithAgendas} user={fakeUser()} />)

  expect((await findAllByLabelText('agenda')).length).toBe(agendas.length)
})

it('should render points', async () => {
  const dashboard = fakeSimpleBlog({points: null})

  const {queryByText, rerender, findByText} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/you've earned/i)).not.toBeInTheDocument()

  const points = fakePoints()
  const dashboardWithPoints = fakeSimpleBlog({
    points,
  })

  rerender(<Dashboard dashboard={dashboardWithPoints} user={fakeUser()} />)

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
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByText(/resources:/i)).not.toBeInTheDocument()

  const numResources = faker.random.number({min: 1, max: 6})
  const withResources = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: Array.from({length: numResources}, fakeResource),
    },
  })

  rerender(<Dashboard dashboard={withResources} user={fakeUser()} />)

  const resources = await findAllByLabelText('event resource')
  expect(resources.length).toBe(numResources)
})

it('should render ticket ribbons', () => {
  const dashboard = fakeSimpleBlog({
    ticketRibbon: null,
  })

  const ticketRibbon = fakeTicketRibbon()

  const {queryByLabelText, rerender} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  const label = `${ticketRibbon.name} ticket`

  expect(queryByLabelText(new RegExp(label))).not.toBeInTheDocument()

  const withTicketRibbon = fakeSimpleBlog({
    ticketRibbon,
  })

  rerender(<Dashboard dashboard={withTicketRibbon} user={fakeUser()} />)

  expect(queryByLabelText(new RegExp(label))).toBeInTheDocument()
})

it('should render sidebarNavButtons', () => {
  const dashboard = fakeSimpleBlog({
    sidebar: {
      background: '#000000',
      textColor: '#ffffff',
      navButtons: [],
    },
  })

  const {queryByLabelText, rerender, queryAllByLabelText} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/sidebar nav/i)).not.toBeInTheDocument()

  const numButtons = faker.random.number({min: 1, max: 5})

  const withNavButtons = fakeSimpleBlog({
    sidebar: {
      background: '#000000',
      textColor: '#ffffff',
      navButtons: Array.from({length: numButtons}, fakeNavButton),
    },
  })

  rerender(<Dashboard dashboard={withNavButtons} user={fakeUser()} />)

  expect(queryAllByLabelText(/sidebar nav/i).length).toBe(numButtons)
})

it('should render a footer', () => {
  const dashboard = fakeSimpleBlog({
    footer: {
      background: '#000000',
      textColor: '#FFFFFF',
      termsLink: null,
      privacyLink: null,
      copyrightText: null,
    },
  })

  const {queryByLabelText, rerender, getByText} = render(
    <Dashboard dashboard={dashboard} user={fakeUser()} />,
  )

  expect(queryByLabelText(/terms of service/i)).not.toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).not.toBeInTheDocument()

  const copyrightText = faker.lorem.sentence()

  const withFooter = fakeSimpleBlog({
    footer: {
      background: '#000000',
      textColor: '#FFFFFF',
      termsLink: faker.internet.url(),
      privacyLink: faker.internet.url(),
      copyrightText,
    },
  })

  rerender(<Dashboard dashboard={withFooter} user={fakeUser()} />)

  expect(queryByLabelText(/terms of service/i)).toBeInTheDocument()
  expect(queryByLabelText(/privacy policy/i)).toBeInTheDocument()

  expect(getByText(new RegExp(copyrightText))).toBeInTheDocument()
})

it('should render blog posts', () => {
  const withoutPosts = fakeSimpleBlog({
    blogPosts: [],
  })

  const {queryByLabelText, rerender, getAllByLabelText, getByText} = render(
    <Dashboard dashboard={withoutPosts} user={fakeUser()} />,
  )

  expect(queryByLabelText('blog post')).not.toBeInTheDocument()

  const numPosts = faker.random.number({min: 1, max: 5})
  const blogPosts = Array.from({length: numPosts}, fakeBlogPost)

  const withPosts = fakeSimpleBlog({
    blogPosts,
  })

  rerender(<Dashboard dashboard={withPosts} user={fakeUser()} />)

  expect(getAllByLabelText('blog post').length).toBe(numPosts)

  for (const post of blogPosts) {
    expect(getByText(post.title)).toBeInTheDocument()
  }
})
