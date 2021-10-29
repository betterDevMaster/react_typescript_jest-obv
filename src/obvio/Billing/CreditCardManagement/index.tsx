import ExistingCard from 'obvio/Billing/CreditCardManagement/ExistingCard'
import NewCardForm from 'obvio/Billing/CreditCardManagement/CreditCardForm'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import React from 'react'

export default function CreditCardManagement(props: {className?: string}) {
  const {paymentMethod} = usePaymentMethod()

  if (!paymentMethod) {
    return <NewCardForm className={props.className} />
  }

  return <ExistingCard className={props.className} />
}
