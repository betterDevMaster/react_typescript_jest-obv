import styled from 'styled-components'
import React from 'react'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'

export default function ExistingCard(props: {className?: string}) {
  const {paymentMethod} = usePaymentMethod()

  if (!paymentMethod) {
    return null
  }

  const {card} = paymentMethod

  return (
    <div className={props.className}>
      <Card>
        <Brand>{card?.brand}</Brand>
        <Numbers>XXXX XXXX XXXX {card?.last4}</Numbers>
        <Expiry>
          Expiry: {card?.exp_month}/{card?.exp_year}
        </Expiry>
      </Card>
    </div>
  )
}

const Card = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: ${(props) => `${props.theme.spacing[7]} ${props.theme.spacing[4]}`};
  display: inline-block;
  margin: 0 0 ${(props) => props.theme.spacing[4]};
`

const Brand = styled.h5`
  margin: 0 0 ${(props) => props.theme.spacing[4]};
`

const Numbers = styled.span`
  font-size: 24px;
  display: block;
  margin: 0 0 ${(props) => props.theme.spacing[2]};
`

const Expiry = styled.span`
  margin: 0;
`
