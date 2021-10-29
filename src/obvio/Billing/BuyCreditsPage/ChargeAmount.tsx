import {formatPrice} from 'lib/currency'
import {Loader} from 'obvio/Billing/CreditCardManagement/CreditCardForm/Form'
import React from 'react'

export default function ChargeAmount(props: {price: number | null}) {
  const {price} = props
  if (!price) {
    return <Loader />
  }

  return (
    <p>
      $
      {formatPrice(price, {
        numDecimals: 2,
      })}
    </p>
  )
}
