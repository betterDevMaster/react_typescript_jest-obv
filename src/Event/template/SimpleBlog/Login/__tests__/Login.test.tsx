import {
  fakeLogin,
  fakeSimpleBlog,
} from 'Event/template/SimpleBlog/__utils__/factory'
import {fakeEvent} from 'Event/__utils__/factory'
import {visitEventSite} from 'Event/__utils__/url'
import React from 'react'
import faker from 'faker'
import {render} from '__utils__/render'
import App from 'App'
import {wait} from '@testing-library/react'
import axios from 'axios'

const mockGet = axios.get as jest.Mock

it('render login page', async () => {
  const background = faker.internet.url()
  const logo = faker.internet.url()
  const descriptionText = faker.lorem.sentence()

  const event = fakeEvent({
    login_background: {
      url: background,
      name: 'background',
    },
    login_logo: {
      url: logo,
      name: 'logo',
    },
    template: fakeSimpleBlog({
      login: fakeLogin({
        description: {
          text: descriptionText,
          color: '#000000',
          fontSize: 18,
        },
      }),
    }),
  })

  visitEventSite({event})

  const {findByLabelText, findByText} = render(<App />)

  await wait(() => {
    expect(mockGet).toBeCalledTimes(1)
  })

  expect(await findByLabelText('login background')).toHaveStyle(
    `background: url(${background})`,
  )

  expect((await findByLabelText('login logo')).getAttribute('src')).toBe(logo)

  expect(await findByText(descriptionText)).toBeInTheDocument()
})
