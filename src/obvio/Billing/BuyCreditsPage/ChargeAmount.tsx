import {formatPrice} from 'lib/currency'
import {Loader} from 'obvio/Billing/CreditCardManagement/NewCardForm'
import React from 'react'

export default function ChargeAmount(props: {price: number | null}) {
  const {price} = props
  if (!price) {
    return <Loader />
  }

  return <p>${formatPrice(price)}</p>
}
