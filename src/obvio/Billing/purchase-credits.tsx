import {PaymentMethod} from '@stripe/stripe-js'
import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useObvioAuth} from 'obvio/auth'
import {teamMemberClient} from 'obvio/obvio-client'

export function usePurchaseCredits() {
  const url = api(`/purchase_credits`)
  const {setUser} = useObvioAuth()

  return (numCredits: number, paymentMethod: PaymentMethod) => {
    return teamMemberClient
      .post<TeamMember>(url, {
        num_credits: numCredits,
        payment_method_id: paymentMethod.id,
      })
      .then(setUser)
  }
}
