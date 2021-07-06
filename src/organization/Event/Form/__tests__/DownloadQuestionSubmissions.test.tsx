import axios from 'axios'
import {render} from '__utils__/render'
import React from 'react'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import DownloadQuestionSubmissions from 'organization/Event/Form/DownloadQuestionSubmissions'
import {useParams} from 'react-router-dom'
import {wait} from '@testing-library/react'

const mockGet = axios.get as jest.Mock
const mockUseParams = useParams as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should download question submissions', async () => {
  const blob = 'somefileblob'
  const file = 'myquestion.csv'
  const url = `https://obv.io/${file}`

  window.URL.createObjectURL = jest.fn()

  mockUseParams.mockImplementationOnce(() => ({
    file,
  }))

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        url,
      },
    }),
  )

  // @ts-ignore
  window.fetch = jest.fn(() => Promise.resolve({blob: jest.fn(() => [blob])}))

  const {findByText} = await render(<DownloadQuestionSubmissions />, {
    organization: fakeOrganization(),
  })

  expect(
    await findByText('Download complete, you may close this window.'),
  ).toBeInTheDocument()

  // Requested correct url
  expect(mockGet).toHaveBeenCalledTimes(1)
  const [downloadUrl] = mockGet.mock.calls[0]
  expect(downloadUrl).toMatch(`/question_submissions/${file}`)

  // Downloaded blob
  await wait(() => {
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })
})
