import {goToImageEntries} from 'organization/Event/ImageEntries/__utils__/go-to-image-entries'
import user from '@testing-library/user-event'
import {fakeImageEntry} from 'Event/__utils__/factory'
import axios from 'axios'
import {wait} from '@testing-library/dom'

const mockGet = axios.get as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should paginate', async () => {
  const pageOne = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const pageTwo = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const pageThree = [fakeImageEntry(), fakeImageEntry(), fakeImageEntry()]
  const {
    findAllByLabelText,
    findByText,
    event,
    findByLabelText,
  } = await goToImageEntries({
    imageEntries: pageOne,
    hasNextPage: true,
  })

  /**
   * Is showing first item from FIRST page
   */

  expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
    `background-image: url(${pageOne[0].file.url})`,
  )

  // check buttons
  expect(await findByLabelText('go prev page')).toBeDisabled()
  expect(await findByLabelText('go next page')).not.toBeDisabled()

  /**
   * Test going to page 2
   */

  // Mock page 2
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageTwo,
        has_next_page: true,
      },
    }),
  )

  user.click(await findByText(/next/i))

  await wait(async () => {
    /**
     * Is showing first item from SECOND page
     */
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageTwo[0].file.url})`,
    )
  })

  // check buttons
  expect(await findByLabelText('go prev page')).not.toBeDisabled()
  expect(await findByLabelText('go next page')).not.toBeDisabled()

  /**
   * Assert fetched next page with the startId of the last item
   */

  const [nextPageUrl] = mockGet.mock.calls[mockGet.mock.calls.length - 1] // get last GET request

  expect(nextPageUrl).toMatch(
    `/events/${event.slug}/image_entries?status=pending&start_id=${pageOne[2].id}&limit=25`,
  )

  /**
   * Test going to page 3
   */

  // Mock page 3
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageThree,
        has_next_page: false,
      },
    }),
  )

  user.click(await findByText(/next/i))

  await wait(async () => {
    // Is showing first item from Third page
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageThree[0].file.url})`,
    )
  })

  // check buttons
  expect(await findByLabelText('go prev page')).not.toBeDisabled()
  expect(await findByLabelText('go next page')).toBeDisabled()

  /**
   * Test going BACK to page 2
   */

  // Mock page
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageTwo,
        has_next_page: true,
      },
    }),
  )

  user.click(await findByText(/prev/i))

  await wait(async () => {
    // Is showing first item from Second page
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageTwo[0].file.url})`,
    )
  })

  const [prevPageUrl] = mockGet.mock.calls[mockGet.mock.calls.length - 1] // get last GET request

  // requested correct prev page id
  expect(prevPageUrl).toMatch(
    `/events/${event.slug}/image_entries?status=pending&start_id=${pageTwo[0].id}&limit=25`,
  )

  // check buttons
  expect(await findByLabelText('go prev page')).not.toBeDisabled()
  expect(await findByLabelText('go next page')).not.toBeDisabled()

  /**
   * Test going back to page 1
   */

  // Mock page
  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        items: pageOne,
        has_next_page: true,
      },
    }),
  )

  user.click(await findByText(/prev/i))

  await wait(async () => {
    // Is showing first item from Second page
    expect((await findAllByLabelText('image entry'))[0]).toHaveStyle(
      `background-image: url(${pageOne[0].file.url})`,
    )
  })

  // check buttons
  expect(await findByLabelText('go prev page')).toBeDisabled()
  expect(await findByLabelText('go next page')).not.toBeDisabled()
})
