import faker from 'faker'
import axios from 'axios'
import {fakeEvent, fakeTechCheck} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {fireEvent, wait} from '@testing-library/react'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {now} from 'lib/date-time'
import {goToTechCheckConfig} from 'organization/Event/TechCheckConfig/__utils__/go-to-tech-check-config'
import {fakeNiftyFifty} from 'Event/template/NiftyFifty/__utils__/factory'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show tech check config', async () => {
  const body = faker.lorem.paragraph()

  const event = fakeEvent({
    tech_check: fakeTechCheck({body}),
    template: fakeNiftyFifty(),
  })
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
    template: fakeNiftyFifty({
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
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [_, templateData] = mockPut.mock.calls[0]
  const {template} = templateData

  const [__, data] = mockPut.mock.calls[1]
  const {body: submitted, area_key} = data

  expect(submitted).toMatch(body) // CKEditor automatically converts to HTML
  expect(area_key).toBe(area.key)

  /**
   * Saved template fields
   */
  expect(template['techCheck.buttonTextColor']).toBeTruthy() // has defaults
})

it('it should set custom buttons', async () => {
  const event = fakeEvent({
    tech_check: null,
    template: fakeNiftyFifty({
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

  // duplicate second button  = 3 buttons total
  user.click((await findAllByLabelText('duplicate component'))[1])

  // Configure SECOND button with page
  user.click((await findAllByLabelText('edit component'))[1])
  fireEvent.mouseDown(await findByLabelText('pick page'))
  user.click(await findByLabelText('Check-In page'))
  fireEvent.click(await findByLabelText('save'))

  // Configure THIRD button to join TC area
  user.click((await findAllByLabelText('edit component'))[2])
  user.click(await findByLabelText('set join tech check area'))
  fireEvent.click(await findByLabelText('save'))

  // Remove first button
  user.click((await findAllByLabelText('edit component'))[0])
  fireEvent.click(await findByLabelText('remove button'))

  user.click(await findByLabelText('save tech check'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [_, data] = mockPut.mock.calls[0]
  const {template} = data

  expect(template['techCheck.hasCustomButtons']).toBe(true)
  // Removed the button
  expect(template['techCheck.buttons.ids'].length).toBe(2)

  const entityId0 = template['techCheck.buttons.ids'][0]
  const entityId1 = template['techCheck.buttons.ids'][1]

  // Did set page
  expect(template[`techCheck.buttons.entities.${entityId0}.page`]).toBe(
    '/tech_check',
  )

  // Did set as TC Area button
  expect(template[`techCheck.buttons.entities.${entityId1}.isAreaButton`]).toBe(
    true,
  )
})

it('it should set rules to skip', async () => {
  const event = fakeEvent({
    tech_check: null,
    template: fakeNiftyFifty({
      techCheck: undefined,
      skipTechCheckRules: [],
    }),
  })

  const {findByLabelText, areas, findByText} = await goToTechCheckConfig({
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

  user.click(await findByText(/skip tech check rules/i))
  user.click(await findByText(/add rule/i))
  const tag = 'foo'
  fireEvent.mouseDown(await findByLabelText('pick rule source'))
  user.click(await findByText(/tags/i))
  user.type(await findByLabelText('new tag target'), tag)
  user.click(await findByLabelText('save rule'))

  user.click(await findByLabelText('save tech check'))

  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(2)
  })

  const [_, data] = mockPut.mock.calls[0]
  const {template} = data

  expect(template.skipTechCheckRules.length).toBe(1)

  expect(template.skipTechCheckRules[0].target).toBe(tag)
})
