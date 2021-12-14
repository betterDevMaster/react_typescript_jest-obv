import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useObvioAuth} from 'obvio/auth'
import {teamMemberClient} from 'obvio/obvio-client'

export function usePurchaseCredits() {
  const url = api(`/purchase_credits`)
  const {setUser} = useObvioAuth()

  return (params: {
    numCredits: number
    paymentMethodId: string
    paymentIntentId?: string
  }) => {
    const body = () => {
      const base = {
        num_credits: params.numCredits,
        payment_method_id: params.paymentMethodId,
      }

      // Payment intent is optional, and is only used for one-off
      // purchase to an existing card, where a payment intent
      // was first previously created.
      if (!params.paymentIntentId) {
        return base
      }

      return {
        ...base,
        payment_intent_id: params.paymentIntentId,
      }
    }

    return teamMemberClient.post<TeamMember>(url, body()).then(setUser)
  }
}
