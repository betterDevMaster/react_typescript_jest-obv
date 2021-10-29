import {useObserve} from 'lib/rx'
import {api} from 'lib/url'
import {useObvioAuth} from 'obvio/auth'
import {useEffect, useState} from 'react'
import {ajax} from 'rxjs/ajax'
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

export interface Plan {
  name: PlanName
  canSubscribe: boolean
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

export const isPlan = (name?: string): name is PlanName => {
  switch (name) {
    case BASIC:
    case PROFESSIONAL:
    case ENTERPRISE:
      return true
    default:
      return false
  }
}

export const BASIC_PLAN: Plan = {
  name: BASIC,
  canSubscribe: true,
  description:
    'Flexible pricing without monthly fees and a 5% fee per transaction.',
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
      details: 'No transaction fees',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited projects',
      isGood: true,
      isActive: false,
    },
    {
      details: 'Unlimited payments',
      isGood: true,
      isActive: false,
    },
    {
      details: 'Email notifications',
      isGood: true,
      isActive: false,
    },
    {
      details: 'Weekly reports',
      isGood: true,
      isActive: false,
    },
    {
      details: 'Customisation options',
      isGood: true,
      isActive: false,
    },
    {
      details: 'No whitelabel branding',
      isGood: true,
      isActive: false,
    },
  ],
}

export const PROFESSIONAL_PLAN: Plan = {
  name: PROFESSIONAL,
  canSubscribe: true,
  description:
    'Flexible pricing without monthly fees and a 5% fee per transaction.',
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
      details: 'No transaction fees',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited projects',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited payments',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Email notifications',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Weekly reports',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Customisation options',
      isGood: true,
      isActive: true,
    },
    {
      details: 'No whitelabel branding',
      isGood: true,
      isActive: true,
    },
  ],
}

export const ENTERPRISE_PLAN: Plan = {
  name: ENTERPRISE,
  canSubscribe: true,
  description:
    'Flexible pricing without monthly fees and a 5% fee per transaction.',
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
      details: 'No transaction fees',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited projects',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited payments',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Email notifications',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Weekly reports',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Customisation options',
      isGood: true,
      isActive: true,
    },
    {
      details: 'No whitelabel branding',
      isGood: true,
      isActive: true,
    },
  ],
}

export const FOUNDER_PLAN: Plan = {
  name: FOUNDER,
  canSubscribe: false,
  description:
    'Flexible pricing without monthly fees and a 5% fee per transaction.',
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
      details: 'No transaction fees',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited projects',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Unlimited payments',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Email notifications',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Weekly reports',
      isGood: true,
      isActive: true,
    },
    {
      details: 'Customisation options',
      isGood: true,
      isActive: true,
    },
    {
      details: 'No whitelabel branding',
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
export function usePriceForCredits(numCredits: number) {
  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState<number | null>(null)
  const {token} = useObvioAuth()
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
          const url = api(`/price_for_credits?num_credits=${numCredits}`)

          const request = ajax.get(url, {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Avoid rxjs from serializing data into [object, object]
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
  }, [value$, onReady, token])

  return {
    loading: loading,
    price: price,
  }
}
