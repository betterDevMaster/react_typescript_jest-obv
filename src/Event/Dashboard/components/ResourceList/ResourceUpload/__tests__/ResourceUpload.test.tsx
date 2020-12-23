import {fireEvent, wait} from '@testing-library/react'
import {fakeUser} from 'auth/user/__utils__/factory'
import Dashboard from 'Event/Dashboard'
import {fakeResource} from 'Event/Dashboard/components/ResourceList/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {fakeOrganization} from 'obvio/Organizations/__utils__/factory'
import React from 'react'
import {clickEdit} from '__utils__/edit'
import {render} from '__utils__/render'
import axios from 'axios'

const mockPost = axios.post as jest.Mock

it('should upload a file', async () => {
  const template = fakeSimpleBlog({
    resourceList: {
      description: '',
      resources: [fakeResource({filePath: ''})],
    },
  })

  const event = fakeEvent({
    template,
  })

  const organization = fakeOrganization()

  const {findByLabelText} = render(
    <Dashboard isEditMode={true} user={fakeUser()} />,
    {
      event,
      organization,
    },
  )

  clickEdit(await findByLabelText('event resource'))

  const file = new File([], 'myfile.pdf')

  const uploadDiv = await findByLabelText('resource upload')

  const filePath = 'somegeneratedfilepath.pdf'

  // Server responds with file path
  mockPost.mockImplementationOnce(() =>
    Promise.resolve({
      data: {
        file: filePath,
      },
    }),
  )

  fireEvent.drop(uploadDiv, {
    dataTransfer: {
      files: [file],
    },
  })

  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/resources`) // was posted to resources

  // Has existing file
  expect(await findByLabelText('remove resource file')).toBeInTheDocument()
})
