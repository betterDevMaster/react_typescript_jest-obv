import {
  Agenda,
  AgendaListProps,
  createAgendaList,
} from 'Event/template/Cards/Dashboard/Sidebar/SidebarItem/AgendaList'
import faker from 'faker'

export const fakeAgenda = (overrides?: Partial<Agenda>): Agenda => ({
  startDate: faker.date.past().toISOString(),
  endDate: faker.random.boolean() ? faker.date.future().toISOString() : null,
  text: faker.random.words(3),
  link: faker.random.boolean() ? faker.internet.url() : null,
  isVisible: faker.random.boolean(),
  ...overrides,
})

export const fakeAgendaList = (
  overrides?: Partial<AgendaListProps>,
): AgendaListProps => ({
  ...createAgendaList(),
  ...overrides,
})

export function withAgendas<T>(attributes: T): T {
  return {
    ...attributes,
    agendas: {
      title: faker.random.word(),
      list: Array.from(
        {length: faker.random.number({min: 0, max: 4})},
        fakeAgenda,
      ),
    },
  }
}
