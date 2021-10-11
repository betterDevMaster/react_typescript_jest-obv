import user from '@testing-library/user-event'
import {
  goToServices,
  ServicesConfigOptions,
} from 'organization/Event/Services/__utils__/go-to-services-config'

export async function goToMailchimp(
  options: ServicesConfigOptions & {
    beforeConfig?: () => void
  } = {},
) {
  const {beforeConfig} = options
  const context = await goToServices(options)

  beforeConfig && beforeConfig()

  user.click(await context.findByLabelText(/mailchimp/i))

  return context
}
