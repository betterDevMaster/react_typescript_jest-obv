import {fakeEvent, fakeLocalization} from 'Event/__utils__/factory'
import {goToLocalizationConfig} from 'organization/Event/LocalizationConfig/__utils__/go-to-localization-config'
import {CONFIGURE_EVENTS} from 'organization/PermissionsProvider'
import axios from 'axios'

it('should have a default when localization is null', async () => {
  const event = fakeEvent({})

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  /**
   * Has system language -- English
   */
  expect(
    ((await findByLabelText('language select')) as HTMLDivElement).textContent,
  ).toMatch(/English \(Default\)/)
})

it('should select the default language', async () => {
  const languages = ['Foo', 'Bar']

  const event = fakeEvent({
    localization: fakeLocalization({
      languages,
      defaultLanguage: 'Bar',
    }),
  })

  const {findByLabelText} = await goToLocalizationConfig({
    event,
    userPermissions: [CONFIGURE_EVENTS],
  })

  // Has default language selected
  expect(
    ((await findByLabelText('language select')) as HTMLDivElement).textContent,
  ).toMatch(/Bar \(Default\)/)
})
