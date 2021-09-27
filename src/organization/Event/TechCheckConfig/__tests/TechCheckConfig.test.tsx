import faker from 'faker'
import axios from 'axios'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {
  EventOverrides,
  goToEventConfig,
} from 'organization/Event/__utils__/event'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {now} from 'lib/date-time'
import {Area} from 'organization/Event/AreasProvider'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'

const mockGet = axios.get as jest.Mock
const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show tech check config', async () => {
  const body = faker.lorem.paragraph()

  const event = fakeEvent({tech_check: fakeTechCheck({body})})
  const {findByLabelText} = await goToTechCheckConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })
  expect(await findByLabelText('tech check body')).toBeInTheDocument()

  const editorValue = ((await findByLabelText(
    'tech check body',
  )) as HTMLInputElement).value

  expect(editorValue).toBe(body)
})

it('should submit a tech check config', async () => {
  const event = fakeEvent({
    tech_check: null,
    template: fakeSimpleBlog({
      techCheck: undefined,
    }),
  })
  const {findByLabelText, areas} = await goToTechCheckConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const area = faker.random.arrayElement(areas)

  fireEvent.mouseDown(await findByLabelText('pick area'))
  user.click(await findByLabelText(`pick ${area.name}`))

  fireEvent.change(await findByLabelText('tech check start'), {
    target: {
      value: now(),
    },
  })

  // Manually set body input because we can't type into CKEditor
  const body = faker.lorem.paragraph()
  const bodyEl = (await findByLabelText('tech check body')) as HTMLInputElement
  bodyEl.value = body

  user.click(await findByLabelText('save tech check'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPut.mock.calls[0]
  const {body: submitted, area_key} = data

  expect(submitted).toMatch(body) // CKEditor automatically converts to HTML
  expect(area_key).toBe(area.key)

  /**
   * Saved template fields
   */
  expect(data.template.techCheck.buttonTextColor).toBeTruthy() // has defaults
})

it('it should set custom buttons', async () => {
  const event = fakeEvent({
    tech_check: null,
    template: fakeSimpleBlog({
      techCheck: undefined,
    }),
  })

  const {
    findByLabelText,
    areas,
    findAllByLabelText,
  } = await goToTechCheckConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const area = faker.random.arrayElement(areas)

  fireEvent.mouseDown(await findByLabelText('pick area'))
  user.click(await findByLabelText(`pick ${area.name}`))

  fireEvent.change(await findByLabelText('tech check start'), {
    target: {
      value: now(),
    },
  })

  // Manually set body input because we can't type into CKEditor
  const body = faker.lorem.paragraph()
  const bodyEl = (await findByLabelText('tech check body')) as HTMLInputElement
  bodyEl.value = body

  user.click(await findByLabelText('set custom buttons'))
  // Add 2 buttons
  user.click(await findByLabelText('add tech check button'))
  user.click(await findByLabelText('add tech check button'))

  //duplicate second button
  user.click((await findAllByLabelText('duplicate component'))[1])

  // Configure second button with page
  user.click((await findAllByLabelText('edit component'))[1])
  fireEvent.mouseDown(await findByLabelText('pick page'))
  user.click(await findByLabelText('Check-In page'))
  fireEvent.click(await findByLabelText('save'))

  // Remove first button
  user.click((await findAllByLabelText('edit component'))[0])
  fireEvent.click(await findByLabelText('remove button'))

  user.click(await findByLabelText('save tech check'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [_, data] = mockPut.mock.calls[0]
  const {template} = data

  expect(template.techCheck.hasCustomButtons).toBe(true)
  // Removed the button
  expect(template.techCheck.buttons.ids.length).toBe(2)
  // Did set page
  expect(
    template.techCheck.buttons.entities[template.techCheck.buttons.ids[0]].page,
  ).toBe('/check_in')
})

async function goToTechCheckConfig(
  overrides: EventOverrides & {areas?: Area[]} = {},
) {
  const context = await goToEventConfig(overrides)

  const areas =
    overrides.areas ||
    Array.from({length: faker.random.number({min: 1, max: 5})}, fakeArea)

  // areas
  mockGet.mockImplementationOnce(() => Promise.resolve({data: areas}))

  user.click(await context.findByLabelText('configure tech check'))

  return {...context, areas}
}
