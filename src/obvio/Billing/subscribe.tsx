import {PaymentMethod} from '@stripe/stripe-js'
import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useObvioAuth, useObvioUser} from 'obvio/auth'
import {Plan, PlanName, PlanInfo} from 'obvio/Billing/plans'
import {teamMemberClient} from 'obvio/obvio-client'

export const SUBSCRIPTION_TYPE_ACTIVE = 'active'
export const SUBSCRIPTION_TYPE_CANCELLED = 'canceled'

export interface Subscription {
  ends_at: string | null
  id: number
  plan: Plan
  renew_plan: PlanName | null
  renews_at: string | null
  stripe_status: string
}

export function useSubscribe() {
  const url = api(`/subscribe`)
  const {setUser} = useObvioAuth()

  return (plan: PlanInfo, paymentMethod: PaymentMethod) => {
    return teamMemberClient
      .post<TeamMember>(url, {
        plan: plan.name,
        payment_method_id: paymentMethod.id,
      })
      .then(setUser)
  }
}

export function useCancel() {
  const url = api(`/subscribe`)
  const {setUser} = useObvioAuth()

  return () => {
    return teamMemberClient.delete<TeamMember>(url).then(setUser)
  }
}

export function useResume() {
  const url = api(`/subscribe`)
  const {setUser} = useObvioAuth()

  return (plan: PlanInfo) => {
    return teamMemberClient
      .put<TeamMember>(url, {
        plan: plan.name,
      })
      .then(setUser)
  }
}

export const useGetSubscription = (
  planName?: string,
  type: string = SUBSCRIPTION_TYPE_ACTIVE,
) => {
  const user = useObvioUser()
  let target = null

  if (!planName) {
    return (user.subscriptions || []).find((subscription) => {
      return subscription.stripe_status === type
    })
  }

  target = (user.subscriptions || []).find((subscription) => {
    return (
      subscription.plan?.name === planName &&
      subscription.stripe_status === type
    )
  })

  return target
}
