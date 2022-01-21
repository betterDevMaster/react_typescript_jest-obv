import {goToInfusionsoft} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/go-to-infusionsoft'
import {
  fakeInfusionsoftIntegration,
  fakeTag,
  tagTypes,
} from 'organization/Event/Services/Apps/Infusionsoft/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import faker from 'faker'
import {fireEvent, wait} from '@testing-library/dom'
import user from '@testing-library/user-event'
import axios from 'axios'
import {hideConsoleWarnings} from 'setupTests'
import {ajax} from 'rxjs/ajax'

const mockPut = axios.put as jest.Mock
const mockRxGet = ajax.get as jest.Mock

jest.mock('rxjs/ajax')

afterEach(() => {
  jest.clearAllMocks()
})

hideConsoleWarnings()

it('should save infusionsoft config', async () => {
  const linked = fakeInfusionsoftIntegration({
    is_linked: true,
  })
  const tags = tagTypes.map((type) => fakeTag({type}))

  const {findAllByLabelText, findByLabelText, event} = await goToInfusionsoft({
    integrations: [linked],
    tags,
    userPermissions: [CONFIGURE_EVENTS],
  })

  const importTagId = faker.random.number({min: 10000, max: 100000})
  const attendeeCreatedTagId = faker.random.number({min: 10000, max: 100000})
  const name = faker.random.word()

  const targetIndexImport = 0
  const targetIndexCreated = 1

  const loginFieldName = 'My login field'
  const loginFieldLabel = 'login_field'

  // add login field

  mockRxGet.mockImplementationOnce(() =>
    Promise.resolve({
      response: [
        {
          name: loginFieldName,
          label: loginFieldLabel,
        },
      ],
    }),
  )

  const autocompleteLT = await findByLabelText('field autocomplete')
  const typeInputLT = await findByLabelText('field search')

  await autocompleteLT.focus()
  await fireEvent.change(typeInputLT, {target: {value: loginFieldName}})

  await wait(async () => {
    expect(mockRxGet).toHaveBeenCalledTimes(1)
  })

  await fireEvent.keyDown(autocompleteLT, {key: 'ArrowDown'})
  await fireEvent.keyDown(autocompleteLT, {key: 'Enter'})

  // add import tag

  mockRxGet.mockImplementationOnce(() =>
    Promise.resolve({
      response: [
        {
          id: importTagId,
          name: name,
        },
      ],
    }),
  )

  const autocomplete = (await findAllByLabelText('tag id holder'))[
    targetIndexImport
  ]
  const typeInput = (await findAllByLabelText('tag id'))[targetIndexImport]

  await autocomplete.focus()
  await fireEvent.change(typeInput, {target: {value: name}})

  await wait(async () => {
    expect(mockRxGet).toHaveBeenCalledTimes(2)
  })

  await fireEvent.keyDown(autocomplete, {key: 'ArrowDown'})
  await fireEvent.keyDown(autocomplete, {key: 'Enter'})

  // add created tag
  mockRxGet.mockImplementationOnce(() =>
    Promise.resolve({
      response: [
        {
          id: attendeeCreatedTagId,
          name: name,
        },
      ],
    }),
  )

  const autocompleteCreated = (await findAllByLabelText('tag id holder'))[
    targetIndexCreated
  ]
  const typeInputCreated = (await findAllByLabelText('tag id'))[
    targetIndexCreated
  ]

  await autocompleteCreated.focus()
  await fireEvent.change(typeInputCreated, {target: {value: name}})

  await wait(async () => {
    expect(mockRxGet).toHaveBeenCalledTimes(3)
  })

  await fireEvent.keyDown(autocompleteCreated, {key: 'ArrowDown'})
  await fireEvent.keyDown(autocompleteCreated, {key: 'Enter'})

  const groupName = 'My group'
  const groupLabel = 'somegroup'

  // add groups
  mockRxGet.mockImplementationOnce(() =>
    Promise.resolve({
      response: [
        {
          label: groupLabel,
          name: groupName,
        },
      ],
    }),
  )

  await user.click(await findByLabelText('add group'))

  const autocompleteCF = (await findAllByLabelText('field autocomplete'))[1]
  const typeInputCF = (await findAllByLabelText('field search'))[1]

  await autocompleteCF.focus()

  await fireEvent.change(typeInputCF, {target: {value: groupName}})

  await wait(async () => {
    expect(mockRxGet).toHaveBeenCalledTimes(4)
  })

  await fireEvent.keyDown(autocompleteCF, {key: 'ArrowDown'})
  await fireEvent.keyDown(autocompleteCF, {key: 'Enter'})

  await user.type((await findAllByLabelText('group name'))[0], name)

  // check save
  mockPut.mockImplementationOnce(() => Promise.resolve({data: 'ok'}))

  expect(await findByLabelText('save')).not.toBeDisabled()
  user.click(await findByLabelText('save'))

  await wait(async () => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/integrations/infusionsoft`)

  expect(data.tags[0].type).toBe('import_tag')
  expect(data.tags[0].infusionsoft_id).toBe(importTagId)

  expect(data.tags[1].type).toBe('attendee_created')
  expect(data.tags[1].infusionsoft_id).toBe(attendeeCreatedTagId)

  expect(data.groups[0].infusionsoft_field_name).toBe(groupName)
  expect(data.groups[0].infusionsoft_field_label).toBe(groupLabel)

  expect(data.login_field.name).toBe(loginFieldName)
  expect(data.login_field.label).toBe(loginFieldLabel)
})
