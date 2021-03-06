import {goToPointsConfig} from 'organization/Event/PointsConfig/__utils__/go-to-points-config'
import faker from 'faker'
import user from '@testing-library/user-event'
import axios from 'axios'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock

beforeAll(() => {
  // Hide JSDOM nav unimplemented error
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // @ts-ignore
  console.error.mockRestore()
})

it('should save exported leaderboard', async () => {
  const csv = faker.random.alphaNumeric(20)

  window.URL.createObjectURL = jest.fn()
  window.URL.revokeObjectURL = jest.fn()

  const {findByLabelText} = await goToPointsConfig()

  mockGet.mockImplementationOnce(() => Promise.resolve({data: {data: csv}}))

  user.click(await findByLabelText('export leaderboard'))

  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  const blob = (window.URL.createObjectURL as jest.Mock).mock.calls[0][0]

  let result: any

  // Test that we are downloading returned file contents
  const reader = new FileReader()
  reader.addEventListener('loadend', () => {
    // reader.result contains the contents of blob as a typed array
    result = reader.result
  })
  reader.readAsText(blob)

  await wait(() => {
    expect(result).toBe(csv)
  })
})
