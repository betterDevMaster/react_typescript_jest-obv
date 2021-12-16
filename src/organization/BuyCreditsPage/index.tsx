import {useBreadcrumbs} from 'lib/ui/BreadcrumbProvider'
import Page from 'lib/ui/layout/Page'
import React, {useState} from 'react'
import {useOrganization} from 'organization/OrganizationProvider'
import Title from 'lib/ui/typography/Title'
import Divider from 'lib/ui/layout/Divider'
import Subheading from 'lib/ui/typography/Subheading'
import {RelativeLink} from 'lib/ui/link/RelativeLink'
import {useToggle} from 'lib/toggle'
import {usePaymentMethod, useGetPlan} from 'organization/PaymentMethodProvider'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import {Redirect, useHistory} from 'react-router-dom'
import NumCreditsSlider, {
  MIN_NUM_CREDITS,
  MAX_NUM_CREDITS,
} from 'obvio/Billing/BuyCreditsPage/CreditsSlider'
import ChargeAmount from 'obvio/Billing/BuyCreditsPage/ChargeAmount'
import SuccessDialog from 'lib/ui/Dialog/SuccessDialog'
import OrganizationCreditBalance from 'obvio/Billing/OrganizationCreditBalance'
import {usePriceForCredits} from 'obvio/Billing/plans'
import ConfirmDialog from 'organization/BuyCreditsPage/ConfirmDialog'
import TextField from '@material-ui/core/TextField'
import {onChangeNumberHandler} from 'lib/dom'
import Layout from 'organization/user/Layout'

export default function BuyCreditsPage() {
  const {
    flag: showingSuccessMessage,
    toggle: toggleSuccessMessage,
  } = useToggle()
  const {routes, organization} = useOrganization()
  const {paymentMethod} = usePaymentMethod()
  const [numCredits, setNumCredits] = useState(MIN_NUM_CREDITS)
  const {price, loading: loadingPrice} = usePriceForCredits(
    numCredits,
    organization,
  )
  const history = useHistory()
  const plan = useGetPlan()

  const {flag: showingConfirmDialog, toggle: toggleConfirmDialog} = useToggle()
  const canPurchase = !loadingPrice && Boolean(price)

  const handleSuccess = () => {
    toggleConfirmDialog()
    toggleSuccessMessage()
  }

  const goToEvents = () => {
    history.push(routes.events.root)
  }

  useBreadcrumbs([
    {
      title: 'Settings',
      url: routes.settings,
    },
    {
      title: 'Credits',
      url: routes.buy_credits,
    },
  ])

  if (!paymentMethod || !plan) {
    return <Redirect to={routes.settings} />
  }

  return (
    <>
      <SuccessDialog showing={showingSuccessMessage} onClose={goToEvents}>
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
            <TextField
              type="number"
              InputProps={{
                inputProps: {min: MIN_NUM_CREDITS, max: MAX_NUM_CREDITS},
              }}
              value={numCredits}
              onChange={onChangeNumberHandler(setNumCredits)}
              variant="outlined"
            />
            <SliderBox>
              <NumCreditsSlider
                value={numCredits}
                onChange={setNumCredits}
                plan={plan}
              />
            </SliderBox>
          </Section>
          <Section>
            <Subheading>Your account will be charged</Subheading>
            <ChargeAmount price={price} />
          </Section>
          <Divider />
          <Actions>
            <RelativeLink to={routes.settings} disableStyles>
              <Button color="primary">Cancel</Button>
            </RelativeLink>
            <Button
              color="primary"
              variant="contained"
              disabled={!canPurchase}
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

const StyledCreditBalance = styled(OrganizationCreditBalance)`
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

const SliderBox = styled.div`
  display: flex;
  justify-content: flex-end;
`
