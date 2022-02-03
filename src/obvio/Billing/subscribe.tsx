import {PaymentMethod} from '@stripe/stripe-js'
import {TeamMember} from 'auth/user'
import {api} from 'lib/url'
import {useObvioAuth, useObvioUser} from 'obvio/auth'
import {Plan, PlanName, PlanInfo} from 'obvio/Billing/plans'
import {teamMemberClient} from 'obvio/obvio-client'

export const SUBSCRIPTION_TYPE_ACTIVE = 'active'
export const SUBSCRIPTION_TYPE_TRIALING = 'trialing'
export const SUBSCRIPTION_TYPE_CANCELLED = 'canceled'

export interface Subscription {
  id: number
  plan: Plan
  renew_plan: PlanName | null
  renews_at: string | null
  stripe_status: string
  ends_at: string | null
  trial_ends_at: string | null
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

export const useGetSubscription = (planName?: string) => {
  const user = useObvioUser()

  if (!user.subscriptions) {
    return
  }

  if (planName) {
    return user.subscriptions.find(
      (s) => s.plan?.name === planName && isActive(s),
    )
  }

  return user.subscriptions.find(isActive)
}

export const isActive = (subscription?: Subscription) => {
  if (!subscription) {
    return false
  }

  return (
    subscription.stripe_status === SUBSCRIPTION_TYPE_ACTIVE ||
    subscription.stripe_status === SUBSCRIPTION_TYPE_TRIALING
  )
}
