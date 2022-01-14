import {fakePaymentMethod} from 'obvio/Billing/__utils__/factory'
import {goToBillingSettings} from 'obvio/Billing/__utils__/go-to-billing-settings'

it('should show button to change card', async () => {
  const {findByText} = await goToBillingSettings({
    paymentMethod: fakePaymentMethod(), // Has card on file
  })

  expect(await findByText(/change card/i)).toBeInTheDocument()
})
