import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import user from '@testing-library/user-event'
import {goToArea} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import {mockPatch} from '__utils__/http'
import {wait} from '@testing-library/react'

it('should update offline text settings', async () => {
  const area = fakeArea({
    // No title/description to start
    offline_title: '',
    offline_description: '',
  })

  const {findByLabelText, findByText, event} = await goToArea({
    userPermissions: [CONFIGURE_EVENTS],
    area,
  })

  const updatedTitle = 'new offline title'
  const updatedDescription = 'new description'

  user.click(await findByText(/offline text/i))

  user.type(await findByLabelText('offline title'), updatedTitle)
  user.type(await findByLabelText('offline description'), updatedDescription)

  const updated = {
    ...area,
    offline_title: updatedTitle,
    offline_description: updatedDescription,
  }

  mockPatch.mockResolvedValueOnce({data: updated})

  user.click(await findByLabelText('save offline text'))

  await wait(() => {
    expect(mockPatch).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPatch.mock.calls[0]

  expect(url).toMatch(`/events/${event.slug}/areas/${area.id}`)

  expect(data.offline_title).toBe(updatedTitle)
  expect(data.offline_description).toBe(updatedDescription)
})
