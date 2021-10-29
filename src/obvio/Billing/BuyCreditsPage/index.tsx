import Layout from 'obvio/user/Layout'
import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useState} from 'react'
import {obvioRoutes} from 'obvio/Routes'
import Title from 'lib/ui/typography/Title'
import Divider from 'lib/ui/layout/Divider'
import Subheading from 'lib/ui/typography/Subheading'
import CreditBalance from 'obvio/Billing/CreditBalance'
import {formatPrice} from 'lib/currency'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useToggle} from 'lib/toggle'
import {usePaymentMethod} from 'obvio/Billing/PaymentMethodProvider'
import Button from '@material-ui/core/Button'
import {usePurchaseCredits} from 'obvio/Billing/purchase-credits'
import styled from 'styled-components'
import {Redirect} from 'react-router-dom'
import NumCreditsSlider, {
  MIN_NUM_CREDITS,
} from 'obvio/Billing/BuyCreditsPage/CreditsSlider'
import ChargeAmount from 'obvio/Billing/BuyCreditsPage/ChargeAmount'
import {usePriceForCredits} from 'obvio/Billing/plans'
import SuccessDialog from 'lib/ui/Dialog/SuccessDialog'
import {usePlan} from 'obvio/Billing/PlanProvider'

export default function BuyCreditsPage() {
  const {
    flag: showingSuccessMessage,
    toggle: toggleSuccessMessage,
  } = useToggle()
  const {flag: processing, toggle: toggleProcessing} = useToggle()
  const {paymentMethod} = usePaymentMethod()
  const purchaseCredits = usePurchaseCredits()
  const [numCredits, setNumCredits] = useState(MIN_NUM_CREDITS)
  const {price, loading: loadingPrice} = usePriceForCredits(numCredits)
  const {plan} = usePlan()

  const canPurchase = !processing && !loadingPrice && Boolean(price)

  useBreadcrumbs([
    {
      title: 'Billing',
      url: obvioRoutes.billing.root,
    },
    {
      title: 'Credits',
      url: obvioRoutes.billing.buy_credits,
    },
  ])

  if (!paymentMethod || !plan) {
    return <Redirect to={obvioRoutes.billing.root} />
  }

  const purchase = () => {
    if (processing) {
      return
    }

    toggleProcessing()

    if (!price) {
      return
    }

    purchaseCredits(numCredits, paymentMethod)
      .then(() => {
        toggleSuccessMessage()
        setNumCredits(MIN_NUM_CREDITS) // Reset num credits
      })
      .finally(toggleProcessing)
  }

  return (
    <>
      <SuccessDialog
        showing={showingSuccessMessage}
        onClose={toggleSuccessMessage}
      >
        Credits Successfully Purchased!
      </SuccessDialog>
      <Layout>
        <Page>
          <Title>Buy Credits</Title>
          <Divider />
          <Section>
            <Subheading>Current Balance</Subheading>
            <StyledCreditBalance />
          </Section>
          <Section>
            <Subheading>Purchase</Subheading>
            <NumCreditsLabel>{formatPrice(numCredits)}</NumCreditsLabel>
            <NumCreditsSlider
              value={numCredits}
              onChange={setNumCredits}
              plan={plan}
            />
          </Section>
          <Section>
            <Subheading>Your account will be charged</Subheading>
            <ChargeAmount price={price} />
          </Section>
          <Divider />
          <Actions>
            <RelativeLink to={obvioRoutes.billing.root} disableStyles>
              <Button color="primary" disabled={processing}>
                Cancel
              </Button>
            </RelativeLink>
            <Button
              color="primary"
              variant="contained"
              disabled={!canPurchase}
              onClick={purchase}
              aria-label="confirm purchase"
            >
              Buy Credits
            </Button>
          </Actions>
        </Page>
      </Layout>
    </>
  )
}

const StyledCreditBalance = styled(CreditBalance)`
  margin-bottom: ${(props) => props.theme.spacing[8]};
`

const Section = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[16]};
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const NumCreditsLabel = styled.h4`
  margin-bottom: ${(props) => props.theme.spacing[2]};
`
