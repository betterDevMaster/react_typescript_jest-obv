import {PaymentMethod} from '@stripe/stripe-js'
import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useObvioAuth} from 'obvio/auth'
import {PlanName as Plan} from 'obvio/Billing/plans'
import {teamMemberClient} from 'obvio/obvio-client'

export function useSubscribe() {
  const url = api(`/subscribe`)
  const {setUser} = useObvioAuth()

  return (plan: Plan, paymentMethod: PaymentMethod) => {
    return teamMemberClient
      .put<TeamMember>(url, {
        plan,
        payment_method_id: paymentMethod.id,
      })
      .then(setUser)
  }
}
