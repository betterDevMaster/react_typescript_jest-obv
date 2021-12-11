import React from 'react'
import user from '@testing-library/user-event'
import {render} from '@testing-library/react'
import PasswordField from 'lib/ui/TextField/PasswordField'

it('should toggle plain text', async () => {
  const {getByLabelText} = render(
    <PasswordField
      inputProps={{
        'aria-label': 'input',
      }}
    />,
  )

  const input = getByLabelText('input')

  expect(input.getAttribute('type')).toBe('password')

  user.click(getByLabelText('toggle show password'))

  // Is now showing as plain text
  expect(input.getAttribute('type')).toBe('text')
})
