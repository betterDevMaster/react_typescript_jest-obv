import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import user from '@testing-library/user-event'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'

it('should switch input types', async () => {
  const event = fakeEvent({
    localization: fakeLocalization({
      translations: undefined,
    }),
  })

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  user.click(await findByLabelText('add field'))

  user.click(await findByLabelText('input HTML'))

  // Switched to HTML, and is now showing option to text
  expect(await findByLabelText('input text')).toBeInTheDocument()

  user.click(await findByLabelText('input text'))

  expect(await findByLabelText('input HTML')).toBeInTheDocument()
})

it('should load as HTML', async () => {
  const event = fakeEvent({
    localization: fakeLocalization({
      translations: {
        English: {
          post_title: '<h1>My Post</h1>', //  HTML Value
        },
      },
    }),
  })

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  // Loaded HTML input automatically, and is now showing option
  // to input text instead
  expect(await findByLabelText('input text')).toBeInTheDocument()
})
