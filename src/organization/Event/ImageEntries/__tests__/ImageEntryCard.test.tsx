import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fakeImageEntry} from 'Event/__utils__/factory'
import axios from 'axios'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should manage approval', async () => {
  const entry = fakeImageEntry()
  const {findByText} = await goToImageEntries({
    imageEntries: [entry],
    hasNextPage: true,
  })

  // validate buttons
  expect(await findByText(/approve/i)).not.toBeDisabled()
  expect(await findByText(/reject/i)).not.toBeDisabled()

  /**
   * Approve
   */

  const approved = {
    ...entry,
    status: 'approved',
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: approved}))

  user.click(await findByText(/approve/i))

  // validate buttons
  expect(await findByText(/approve/i)).toBeDisabled()
  expect(await findByText(/reject/i)).not.toBeDisabled()

  const [approveUrl] = mockPut.mock.calls[0]
  expect(approveUrl).toMatch(`/image_entries/${entry.id}/approve`)

  /**
   * Reject
   */

  const rejected = {
    ...entry,
    status: 'rejected',
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: rejected}))

  user.click(await findByText(/reject/i))

  // validate buttons
  expect(await findByText(/approve/i)).not.toBeDisabled()
  expect(await findByText(/reject/i)).toBeDisabled()

  const [rejectUrl] = mockPut.mock.calls[1]
  expect(rejectUrl).toMatch(`/image_entries/${entry.id}/reject`)
})
