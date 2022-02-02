import {goToWaiverConfig} from 'Event/Step2/__utils__/go-to-waiver-config'
import user from '@testing-library/user-event'
import {ENTERPRISE} from 'obvio/Billing/plans'
import {fakePlan} from 'obvio/Billing/__utils__/factory'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {fireEvent, wait} from '@testing-library/react'
import {fakeEvent, fakeWaiver} from 'Event/__utils__/factory'
import {mockDelete, mockGet, mockPost} from '__utils__/http'
import {fakeForm} from 'organization/Event/FormsProvider/__utils__/factory'
import {fakeAdditionalWaiver} from 'organization/Event/WaiverConfig/AdditionalWaivers/__utils__/factory'
import {allTemplates} from 'Event/template/__utils__/tester'

beforeAll(() => {
  // Patch fetch to automatically return the existing waiver logo blob
  // @ts-ignore
  window.fetch = jest.fn(() =>
    Promise.resolve(() => ({blob: jest.fn(() => [])})),
  )

  window.URL.createObjectURL = jest.fn()
})

allTemplates('should add an additional waiver', async (fakeTemplate) => {
  const form = fakeForm()
  const event = fakeEvent({
    waiver: fakeWaiver(), // has a waiver
    forms: [form],
    template: fakeTemplate(),
  })

  const {findByLabelText, findByText, findByTestId} = await goToWaiverConfig({
    userPermissions: [CONFIGURE_EVENTS],
    owner: fakeTeamMember({
      plan: fakePlan({
        name: ENTERPRISE,
      }),
    }),
    event,
  })

  // No additional waivers to start
  mockGet.mockResolvedValueOnce({data: []})

  user.click(await findByText(/additional waivers/i))
  user.click(await findByText(/add additional waiver/i))

  const title = 'Crew Waiver'
  user.type(await findByLabelText('waiver title'), title)

  // Set a  logo
  const image = new File([], 'logo.jpg')
  const imageInput = await findByLabelText('logo input')
  Object.defineProperty(imageInput, 'files', {
    value: [image],
  })
  fireEvent.change(imageInput)

  // select form
  fireEvent.mouseDown(await findByLabelText('select form'))
  user.click(await findByLabelText(`pick ${form.name}`))

  const agreeStatement = 'I agree'
  user.type(await findByLabelText('waiver agree statement'), agreeStatement)

  const signPrompt = 'please sign'
  user.type(await findByLabelText('waiver signature prompt'), signPrompt)

  const body = 'this is a custom waiver'
  user.type(await findByTestId('text editor'), body)

  const added = fakeAdditionalWaiver({title})
  mockPost.mockResolvedValueOnce({data: added})

  user.click(await findByLabelText('save additional waiver'))

  expect(await findByText(new RegExp(added.title || ''))).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)
  const [url, data] = mockPost.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/additional_waivers`)

  expect(data.get('title')).toBe(title)
  expect(data.get('body')).toBe(body)
  expect(data.get('logo')).toBe(image)
  expect(data.get('agree_statement')).toBe(agreeStatement)
  expect(data.get('is_enabled')).toBe('true')
  expect(data.get('signature_prompt')).toBe(signPrompt)
  expect(data.get('form_id')).toBe(String(form.id))
})

allTemplates('should update a waiver', async (fakeTemplate) => {
  const form = fakeForm()

  const {findByLabelText, findByText, findByTestId} = await goToWaiverConfig({
    userPermissions: [CONFIGURE_EVENTS],
    owner: fakeTeamMember({
      plan: fakePlan({
        name: ENTERPRISE,
      }),
    }),
    event: fakeEvent({
      waiver: fakeWaiver(), // has a waiver
      forms: [form],
      template: fakeTemplate(),
    }),
  })

  const prevTitle = 'Crew Waiver'
  const target = fakeAdditionalWaiver({title: prevTitle})
  const waivers = [target, fakeAdditionalWaiver(), fakeAdditionalWaiver()]

  mockGet.mockResolvedValueOnce({data: waivers})

  user.click(await findByText(/additional waivers/i))
  user.click(await findByText(/add additional waiver/i))

  user.click(await findByText(prevTitle))

  const newTitle = 'VIP Waiver'
  user.type(await findByLabelText('waiver title'), newTitle)

  user.type(await findByTestId('text editor'), 'some waiver body')

  mockPost.mockResolvedValueOnce({
    data: {
      ...target,
      title: newTitle,
    },
  })

  user.click(await findByLabelText('save additional waiver'))

  expect(await findByText(newTitle)).toBeInTheDocument()

  expect(mockPost).toHaveBeenCalledTimes(1)

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/additional_waivers/${target.id}`)

  expect(data.get('title')).toBe(newTitle)
})

allTemplates('should remove a waiver', async (fakeTemplate) => {
  const form = fakeForm()

  const {findByText, queryByText} = await goToWaiverConfig({
    userPermissions: [CONFIGURE_EVENTS],
    owner: fakeTeamMember({
      plan: fakePlan({
        name: ENTERPRISE,
      }),
    }),
    event: fakeEvent({
      waiver: fakeWaiver(), // has a waiver
      forms: [form],
      template: fakeTemplate(),
    }),
  })

  const title = 'Crew Waiver'
  const target = fakeAdditionalWaiver({title: title})
  const waivers = [fakeAdditionalWaiver(), target, fakeAdditionalWaiver()]

  mockGet.mockResolvedValueOnce({data: waivers})

  user.click(await findByText(/additional waivers/i))
  user.click(await findByText(/add additional waiver/i))

  user.click(await findByText(title)) // edit waiver

  mockDelete.mockResolvedValueOnce({data: 'ok'}) // delete response
  user.click(await findByText(/remove/i)) // remove waiver

  await wait(() => {
    expect(queryByText(title)).not.toBeInTheDocument()
  })
})
