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
import styled from 'styled-components'
import {Redirect, useHistory} from 'react-router-dom'
import NumCreditsSlider, {
  MIN_NUM_CREDITS,
} from 'obvio/Billing/BuyCreditsPage/CreditsSlider'
import ChargeAmount from 'obvio/Billing/BuyCreditsPage/ChargeAmount'
import {usePriceForCredits} from 'obvio/Billing/plans'
import SuccessDialog from 'lib/ui/Dialog/SuccessDialog'
import {usePlan} from 'obvio/Billing/PlanProvider'
import ConfirmDialog from 'obvio/Billing/BuyCreditsPage/ConfirmDialog'

export default function BuyCreditsPage() {
  const {
    flag: showingSuccessMessage,
    toggle: toggleSuccessMessage,
  } = useToggle()
  const {paymentMethod} = usePaymentMethod()
  const [numCredits, setNumCredits] = useState(MIN_NUM_CREDITS)
  const {price} = usePriceForCredits(numCredits)
  const {plan} = usePlan()
  const history = useHistory()

  const {flag: showingConfirmDialog, toggle: toggleConfirmDialog} = useToggle()

  const goBackToBillingRoot = () => {
    history.push(obvioRoutes.billing.root)
  }

  const handleSuccess = () => {
    toggleConfirmDialog()
    toggleSuccessMessage()
  }

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

  return (
    <>
      <SuccessDialog
        showing={showingSuccessMessage}
        onClose={goBackToBillingRoot}
      >
        Credits Successfully Purchased!
      </SuccessDialog>
      <ConfirmDialog
        showing={showingConfirmDialog}
        onClose={toggleConfirmDialog}
        numCredits={numCredits}
        onSuccess={handleSuccess}
        paymentMethod={paymentMethod}
        price={price}
      />
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
            <NumCreditsLabel>
              {/* Not actually a price, but we're using it to format for thousandth's. */}
              {formatPrice(numCredits, {numDecimals: 0})}
            </NumCreditsLabel>
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
              <Button color="primary">Cancel</Button>
            </RelativeLink>
            <Button
              color="primary"
              variant="contained"
              onClick={toggleConfirmDialog}
              aria-label="buy credits"
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
