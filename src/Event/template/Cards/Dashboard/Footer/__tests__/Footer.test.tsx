import faker from 'faker'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should configure the footer', async () => {
  const copyrightText = faker.lorem.paragraph()
  const event = fakeEvent({
    template: fakeCards({
      footer: {
        background: '#000000',
        textColor: '#FFFFFF',
        termsLink: null,
        privacyLink: null,
        copyrightText: null,
      },
    }),
  })

  const {findByLabelText} = await goToDashboardConfig({event})

  clickEdit(await findByLabelText('footer'))

  fireEvent.change(await findByLabelText('set copyright text'), {
    target: {
      value: copyrightText,
    },
  })

  fireEvent.click(await findByLabelText('save'))

  expect((await findByLabelText('copyright')).textContent).toBe(copyrightText)

  // Saved
  await wait(
    () => {
      expect(mockPost).toHaveBeenCalledTimes(1)
    },
    {
      timeout: 20000,
    },
  )

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.footer.copyrightText).toBe(copyrightText)
})
