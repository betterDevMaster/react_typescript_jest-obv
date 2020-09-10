import {Agenda} from 'Dashboard/components/AgendaList'
import faker from 'faker'

export const fakeAgenda = (): Agenda => ({
  startDate: faker.date.past().toISOString(),
  endDate: faker.random.boolean()
    ? faker.date.future().toISOString()
    : undefined,
  text: faker.random.words(3),
  link: faker.random.boolean() ? faker.internet.url() : undefined,
})

export function withAgendas<T>(attributes: any): T {
  return {
    ...attributes,
    agendas: Array.from(
      {length: faker.random.number({min: 0, max: 4})},
      fakeAgenda,
    ),
  }
}
