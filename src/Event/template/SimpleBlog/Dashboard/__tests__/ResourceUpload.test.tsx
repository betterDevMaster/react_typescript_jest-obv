import React, {ReactElement} from 'react'
import {act, fireEvent, render, waitFor, screen} from '@testing-library/react'
import ResourceUpload, {
  UploadDropzone,
} from 'Event/Dashboard/components/ResourceList/ResourceUpload'
import {fakeEvent} from 'Event/__utils__/factory'
import {renderWithEvent} from '__utils__/render'
import faker from 'faker'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeResource} from 'Event/Dashboard/components/ResourceList/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {fakeUser} from 'auth/user/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'

const mockPost = mockRxJsAjax.post as jest.Mock

function mockData(files: File[]) {
  return {
    dataTransfer: {
      files,
      items: files.map((file: File) => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
  }
}

async function flushPromises(
  rerender: (ui: ReactElement) => void,
  ui: JSX.Element,
) {
  await act(() => waitFor(() => rerender(ui)))
}

afterEach(() => {
  jest.clearAllMocks()
})

it('should trigger upload request', async () => {
  const file = new File([JSON.stringify({ping: true})], 'sample.png', {
    type: 'application/json',
  })
  const data = mockData([file])
  const setIsUploading = jest.fn()
  const setHasUploadingError = jest.fn()
  const uploadFileRequest = jest.fn()
  const event = fakeEvent()

  const dropzoneUI = (
    <UploadDropzone
      uploadFileRequest={uploadFileRequest}
      setIsUploading={setIsUploading}
      setHasUploadingError={setHasUploadingError}
    />
  )

  const {rerender, container} = renderWithEvent(dropzoneUI, event)

  const dropzone = container.querySelector('div') as Element
  fireEvent.drop(dropzone, data)
  await flushPromises(rerender, dropzoneUI)

  expect(setIsUploading).toHaveBeenCalled()
  expect(uploadFileRequest).toHaveBeenCalled()
})

it('should remove the previously uploaded file', async () => {
  const initFile = new File([JSON.stringify({ping: true})], 'sample.png', {
    type: 'application/json',
  })
  const data = mockData([initFile])

  const name = faker.random.word()
  const dashboard = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [fakeResource({name})],
    },
  })

  const event = fakeEvent({template: dashboard})

  const {
    queryByLabelText,
    findByLabelText,
    findAllByLabelText,
    container,
    rerender,
  } = renderWithEvent(<Dashboard isEditMode={true} user={fakeUser()} />, event)

  // expect(queryByLabelText('event resource')).not.toBeInTheDocument()

  fireEvent.click(await findByLabelText('add resource'))

  await waitFor(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const dropzone = await queryByLabelText('resource upload')

  expect(dropzone).toBeInTheDocument()

  fireEvent.drop(dropzone as Element, data)
  await waitFor(() => {
    console.log('hello')
    expect(mockPost).toHaveBeenCalledTimes(1)
  })
})
