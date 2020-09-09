import React from 'react'
import faker from 'faker'
import {fireEvent} from '@testing-library/react'
import {fakeSimpleBlog} from 'Dashboard/templates/SimpleBlog/__utils__/factory'
import {fakeUser} from 'user/__utils__/factory'
import {fakeMainNavButton} from 'Dashboard/components/MainNavButton/__utils__/factory'
import {setWindowMatchMedia} from '__utils__/media-query'
import Dashboard from 'Dashboard'
import {render} from '__utils__/render'
import ThemeProvider from 'ui/theme/ThemeProvider'
import {fakeAgenda} from 'Dashboard/components/AgendaList/__utils__/factory'
import {ALL_EMOJIS} from 'Dashboard/components/EmojiList/emoji'

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
    fakeMainNavButton,
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
  rerender(
    <ThemeProvider>
      <Dashboard dashboard={dashboardWithAgendas} user={fakeUser()} />
    </ThemeProvider>,
  )

  expect((await findAllByLabelText('agenda')).length).toBe(agendas.length)
})
