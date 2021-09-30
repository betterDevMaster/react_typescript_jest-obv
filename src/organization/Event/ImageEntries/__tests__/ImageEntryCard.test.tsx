import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fakeImageEntry} from 'Event/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/dom'

const mockPut = axios.put as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should approve an entry', async () => {
  const entry = fakeImageEntry()
  const {findByText, queryByText} = await goToImageEntries({
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

  const [approveUrl] = mockPut.mock.calls[0]
  expect(approveUrl).toMatch(`/image_entries/${entry.id}/approve`)

  await wait(() => {
    // item was removed
    expect(queryByText(/approve/i)).not.toBeInTheDocument()
  })
})

it('should reject an entry', async () => {
  const entry = fakeImageEntry()
  const {findByText, queryByText} = await goToImageEntries({
    imageEntries: [entry],
    hasNextPage: true,
  })

  // validate buttons
  expect(await findByText(/approve/i)).not.toBeDisabled()
  expect(await findByText(/reject/i)).not.toBeDisabled()

  /**
   * reject
   */

  const rejected = {
    ...entry,
    status: 'rejected',
  }

  mockPut.mockImplementationOnce(() => Promise.resolve({data: rejected}))

  user.click(await findByText(/reject/i))

  const [approveUrl] = mockPut.mock.calls[0]
  expect(approveUrl).toMatch(`/image_entries/${entry.id}/reject`)

  await wait(() => {
    // item was removed
    expect(queryByText(/reject/i)).not.toBeInTheDocument()
  })
})
