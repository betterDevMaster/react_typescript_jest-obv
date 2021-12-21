import {ajax, useObserve} from 'lib/rx'
import {api} from 'lib/url'
import {useAuthToken, useObvioUser} from 'obvio/auth'
import {useUserOrganizations} from 'obvio/Organizations/UserOrganizationsProvider'
import {Organization} from 'organization'
import {useEffect, useState} from 'react'
import {debounceTime, map, switchMap, tap} from 'rxjs/operators'

export const BASIC = 'basic'
export const PROFESSIONAL = 'professional'
export const ENTERPRISE = 'enterprise'
export const FOUNDER = 'founder'

export type PlanName =
  | typeof PROFESSIONAL
  | typeof BASIC
  | typeof ENTERPRISE
  | typeof FOUNDER

// Plan model as defined in API
export type Plan = {
  name: PlanName
  rooms_per_event: number
  annual_credits: number
  organization_limit: number
}

// Plan info used in the front-end only
export interface PlanInfo {
  name: PlanName
  label: string
  description: string
  price: number
  features: Feature[]
  creditPackages: CreditPackage[]
}

interface Feature {
  details: string
  isGood: boolean
  isActive: boolean
}

export interface CreditPackage {
  amount: number
  price: number
}

export const BASIC_PLAN: PlanInfo = {
  name: BASIC,
  label: 'Obvio',
  description: '1 Organization, 600 Annual Credits, 3 Rooms per Event',
  price: 997,
  creditPackages: [
    {
      amount: 100,
      price: 15,
    },
    {
      amount: 200,
      price: 28,
    },
    {
      amount: 500,
      price: 125,
    },
  ],
  features: [
    {
      details: 'Unlimited Events',
      isGood: true,
      isActive: true,
    },
    {
      details: '600 Attendee Credits',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Event Durations up to 4 Days',
      isGood: true,
      isActive: true,
    },
    {
      details: '3 Zoom Rooms Per Event *',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Cloud Based Event Recording',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited Team Members',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Includes 1 Organization',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Additional Credits from $3.00 **',
      isGood: true,
      isActive: true,
    },
  ],
}

export const PROFESSIONAL_PLAN: PlanInfo = {
  name: PROFESSIONAL,
  label: 'Obvio Pro',
  description: '3 Organizations, 1,200 Annual Credits, 10 Rooms per Event',
  price: 1997,
  creditPackages: [
    {
      amount: 100,
      price: 10,
    },
    {
      amount: 200,
      price: 18,
    },
    {
      amount: 500,
      price: 40,
    },
  ],
  features: [
    {
      details: 'Includes All Obvio Features, Plus',
      isGood: true,
      isActive: true,
    },
    {
      details: '1,200 Total Attendee Credits',
      isGood: true,
      isActive: true,
    },
    {
      details: '10 Rooms per Event **',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Includes 3 Organizations',
      isGood: true,
      isActive: true,
    },
  ],
}

export const ENTERPRISE_PLAN: PlanInfo = {
  name: ENTERPRISE,
  label: 'Obvio Enterprise',
  description:
    'Unlimited Organizations, 3,600 Annual Credits, 25 Rooms per Event',
  price: 4997,
  creditPackages: [
    {
      amount: 100,
      price: 10,
    },
    {
      amount: 200,
      price: 18,
    },
    {
      amount: 500,
      price: 40,
    },
  ],
  features: [
    {
      details: 'Includes All Obvio Pro Features Plus',
      isGood: true,
      isActive: true,
    },
    {
      details: '3,600 Total Attendee Credits',
      isGood: true,
      isActive: true,
    },
    {
      details: '25 Rooms per Event *',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited Organizations',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Additional Credits $1.00 **',
      isGood: true,
      isActive: true,
    },
  ],
}

export const FOUNDER_PLAN: PlanInfo = {
  name: FOUNDER,
  label: 'Obvio Founders',
  description:
    'Unlimited Organizations, 1,000 Annual Credits, 3 Rooms per Event',
  price: 1500,
  creditPackages: [
    {
      amount: 100,
      price: 10,
    },
    {
      amount: 200,
      price: 18,
    },
    {
      amount: 500,
      price: 40,
    },
  ],
  features: [
    {
      details: 'Includes All Features of Obvio Plus',
      isGood: true,
      isActive: true,
    },
    {
      details: '1,000 Total Attendee Credits',
      isGood: true,
      isActive: true,
    },
    {
      details: '3 Rooms per Event *',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited Organizations',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Additional Credits $1.00 **',
      isGood: true,
      isActive: true,
    },
  ],
}

/**
 * Available plans. Order here matters to determine the plan
 * tier, and prevent downgrades. Cheapest first.
 */
export const PLANS = [
  BASIC_PLAN,
  PROFESSIONAL_PLAN,
  ENTERPRISE_PLAN,
  FOUNDER_PLAN,
]

export const isPlan = (name?: string): name is PlanName => {
  switch (name) {
    case BASIC:
    case PROFESSIONAL:
    case ENTERPRISE:
    case FOUNDER:
      return true
    default:
      return false
  }
}

export function useAvailablePlans() {
  const user = useObvioUser()

  if (user.is_founder) {
    return PLANS
  }

  // Normal users can NOT subscribe to 'founder' plan
  return PLANS.filter((p) => p !== FOUNDER_PLAN)
}

export const getPlan = (plan: PlanName) => {
  const target = PLANS.find((p) => p.name === plan)
  if (!target) {
    throw new Error(`Missing plan info for plan: ${plan}`)
  }

  return target
}

/**
 * Get the plan tier, an incrementing number indicating
 * the plan level. With 1 being the lowest plan.
 * @param plan
 * @returns
 */
export const tier = (plan: PlanName) => {
  const index = PLANS.findIndex((p) => p.name === plan)
  if (index === -1) {
    throw new Error(`Missing plan: ${plan}`)
  }

  return index + 1
}

/**
 * Get the price for a given amount of credits. The price is calculated
 * server-side according to the user's plan.
 *
 * @param numCredits
 * @returns
 */
export function usePriceForCredits(
  numCredits: number,
  organization?: Organization,
) {
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState<number | null>(null)
  const token = useAuthToken()
  const {value$, onReady} = useObserve(numCredits)

  useEffect(() => {
    if (!onReady) {
      return
    }

    value$
      .pipe(
        tap(() => {
          setLoading(true)
          setPrice(null)
        }),
        debounceTime(1000),
        switchMap((numCredits: number) => {
          const url = calculatePriceUrl(numCredits, organization)

          const request = ajax.get(url, {
            accessToken: token,
          })

          return request
        }),
        map((res) => res.response.price),
        tap(() => {
          setLoading(false)
        }),
      )
      .subscribe({
        next: setPrice,
      })

    onReady()
  }, [value$, onReady, token, organization])

  return {
    loading: loading,
    price: price,
  }
}

/**
 * Get the URL for price calculations.
 *
 * @param numCredits
 * @param organization
 * @returns
 */
function calculatePriceUrl(numCredits: number, organization?: Organization) {
  // If no organization is supplied, we assume it's the owner
  // trying to calculate the price.
  if (!organization) {
    return api(`/price_for_credits?num_credits=${numCredits}`)
  }

  // If we have an organization we'll calculate the price using
  // the team endpoint.
  return api(
    `/organizations/${organization.id}/price_for_credits?num_credits=${numCredits}`,
  )
}

export function useCanCreateOrganization() {
  const user = useObvioUser()
  const {organizations} = useUserOrganizations()

  if (!user.plan) {
    return false
  }

  // If user's plan has no limit, we will always allow them
  // to create more.
  if (!user.plan.organization_limit) {
    return true
  }

  const numOwned = organizations.filter((o) => o.joined).length

  // Can create if below plan limit
  return numOwned < user.plan.organization_limit
}
