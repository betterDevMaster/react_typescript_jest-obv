import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import {useToggle} from 'lib/toggle'
import {teamMemberClient} from 'obvio/obvio-client'
import {api} from 'lib/url'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'

export default function ExistingCard(props: {className?: string}) {
  const {setPaymentMethod, paymentMethod} = usePaymentMethod()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const removeCard = useRemoveCard()

  if (!paymentMethod) {
    throw new Error('Missing payment method')
  }

  const {card} = paymentMethod

  const handleRemove = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    removeCard()
      .then(() => setPaymentMethod(null))
      .catch(toggleProcessing)
  }

  return (
    <div className={props.className}>
      <Card>
        <Brand>{card?.brand}</Brand>
        <Numbers>XXXX XXXX XXXX {card?.last4}</Numbers>
        <Expiry>
          Expiry: {card?.exp_month}/{card?.exp_year}
        </Expiry>
      </Card>
      <div>
        <DangerButton
          variant="outlined"
          disabled={processing}
          onClick={handleRemove}
        >
          Remove Card
        </DangerButton>
      </div>
    </div>
  )
}

function useRemoveCard() {
  return () => {
    const url = api('/stripe/payment_method')

    return teamMemberClient.delete(url)
  }
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
