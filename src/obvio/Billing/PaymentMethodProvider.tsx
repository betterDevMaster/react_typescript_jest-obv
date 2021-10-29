import {PaymentMethod} from '@stripe/stripe-js'
import {useAsync} from 'lib/async'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {api} from 'lib/url'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback, useEffect, useState} from 'react'

type PaymentMethodContextProps = {
  paymentMethod: null | PaymentMethod
  setPaymentMethod: (paymentMethod: PaymentMethod | null) => void
}

const PaymentMethodContext = React.createContext<
  undefined | PaymentMethodContextProps
>(undefined)

export function PaymentMethodProvider(props: {children: React.ReactElement}) {
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
  const request = useCallback(() => {
    const url = api('/stripe/payment_method')

    return teamMemberClient.get<PaymentMethod>(url)
  }, [])

  const {data: paymentMethod, ...res} = useAsync(request)

  return {paymentMethod, ...res}
}
