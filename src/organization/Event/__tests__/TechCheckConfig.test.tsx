import faker from 'faker'
import axios from 'axios'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {ObvioEvent} from 'Event'
import {goToEventConfig} from 'organization/Event/__utils__/event'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should show tech check config', async () => {
  const body = faker.lorem.paragraph()

  const event = fakeEvent({tech_check: fakeTechCheck({body})})
  const {findByLabelText} = await goToTechCheckConfig({event})
  expect(await findByLabelText('tech check body')).toBeInTheDocument()

  const editorValue = ((await findByLabelText(
    'tech check body',
  )) as HTMLInputElement).value

  expect(editorValue).toBe(body)
})

it('should submit a tech check config', async () => {
  const event = fakeEvent({tech_check: null})
  const {findByLabelText, areas} = await goToTechCheckConfig({event})

  const area = faker.random.arrayElement(areas)

  fireEvent.mouseDown(await findByLabelText('pick area'))
  user.click(await findByLabelText(`pick ${area.name}`))

  // Manually set body input because we can't type into CKEditor
  const body = faker.lorem.paragraph()
  const bodyEl = (await findByLabelText('tech check body')) as HTMLInputElement
  bodyEl.value = body

  user.click(await findByLabelText('save tech check'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPut.mock.calls[0]
  const {body: submitted, area_id} = data

  expect(submitted).toBe(body) // CKEditor automatically converts to HTML
  expect(area_id).toBe(area.id)
})

async function goToTechCheckConfig(overrides: {event?: ObvioEvent} = {}) {
  const context = await goToEventConfig(overrides)

  user.click(await context.findByLabelText('configure tech check'))

  return context
}
