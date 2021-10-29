import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import React from 'react'

export default function IfHasRegisteredCard(props: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const {paymentMethod} = usePaymentMethod()
  if (!paymentMethod) {
    return null
  }

  return <>{props.children}</>
}
