import faker from 'faker'
import {fireEvent, wait} from '@testing-library/react'
import {
  fakeAgenda,
  fakeAgendaList,
} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/AgendaList/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {createHashMap} from 'lib/list'
import {inputElementFor} from '__utils__/render'
import {TAGS} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'

const mockPut = axios.put as jest.Mock

it('should save sidebar item rules', async () => {
  const sidebarItems = createHashMap([fakeAgendaList()])

  const event = fakeEvent({
    template: fakeCards({
      sidebarItems,
    }),
  })

  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  user.click(await findByText(/rules/i))

  user.click(await findByLabelText('add rule'))

  // Select tags as source
  fireEvent.change(inputElementFor(await findByLabelText('pick rule source')), {
    target: {
      value: TAGS,
    },
  })

  const target = faker.random.word()
  user.type(await findByLabelText('new tag target'), target)

  user.click(await findByLabelText('save rule'))
  user.click(await findByLabelText('close dialog'))

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const sidebarId = Object.keys(sidebarItems)[0]

  expect(data.template[`sidebarItems.${sidebarId}.rules`][0].target).toBe(
    target,
  )
})
