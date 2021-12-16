import {PaymentMethod} from '@stripe/stripe-js'
import {useAsync} from 'lib/async'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {TeamMember} from 'auth/user'
import {teamMemberClient} from 'obvio/obvio-client'
import {useObvioAuth} from 'obvio/auth'
import {useIsOwner, useOwner} from 'organization/OwnerProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {getPlan} from 'obvio/Billing/plans'

type PaymentMethodContextProps = {
  paymentMethod: null | PaymentMethod
  setPaymentMethod: (paymentMethod: PaymentMethod | null) => void
}

const PaymentMethodContext = React.createContext<
  undefined | PaymentMethodContextProps
>(undefined)

export function PaymentMethodProvider(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const {paymentMethod: savedPaymentMethod, loading} = useSavedPaymentMethod()

  useEffect(() => {
    if (!savedPaymentMethod) {
      return
    }

    setPaymentMethod(savedPaymentMethod)
  }, [savedPaymentMethod])

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {props.children}
    </PaymentMethodContext.Provider>
  )
}

export function usePaymentMethod() {
  const context = React.useContext(PaymentMethodContext)
  if (context === undefined) {
    throw new Error(
      'usePaymentMethod must be used within a PaymentMethodProvider',
    )
  }

  return context
}

function useSavedPaymentMethod() {
  const {organization} = useOrganization()
  const request = useCallback(() => {
    const url = api(`/organizations/${organization.id}/payment_method`)

    return teamMemberClient.get<PaymentMethod>(url)
  }, [organization.id])

  const {data: paymentMethod, ...res} = useAsync(request)

  return {paymentMethod, ...res}
}

export function usePurchaseCredits() {
  const {organization} = useOrganization()
  const {setOwner} = useOwner()
  const {setUser} = useObvioAuth()
  const isOwner = useIsOwner()
  const url = api(`/organizations/${organization.id}/purchase_credits`)

  return (numCredits: number, paymentMethod: PaymentMethod) => {
    return teamMemberClient
      .post<TeamMember>(url, {
        num_credits: numCredits,
        payment_method_id: paymentMethod.id,
      })
      .then((user) => {
        if (isOwner) {
          setUser(user)
        }
        setOwner(user)
      })
  }
}

export function useGetPlan() {
  const {owner} = useOwner()
  if (!owner) return null
  const plan = owner.plan ? getPlan(owner.plan.name) : null
  return plan
}
