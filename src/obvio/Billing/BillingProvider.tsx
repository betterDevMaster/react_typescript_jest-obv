import InsufficientCreditsPopup from 'obvio/Billing/InsufficientCreditsPopup'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export type CreditsError = {
  type: 'insufficient_credits'
  credits_short: number
}

type BillingContextProps = {
  missingCredits: number
  setMissingCredits: (numCredits: number) => void
}

const BillingContext = React.createContext<undefined | BillingContextProps>(
  undefined,
)

export default function BillingProvider(props: {children: React.ReactElement}) {
  const [missingCredits, setMissingCredits] = useState(0)

  useEffect(() => {
    const missingCreditsInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const data = error.response?.data
        if (isCreditsError(data)) {
          setMissingCredits(data.credits_short)
        }

        return Promise.reject(error)
      },
    )

    return () => {
      axios.interceptors.response.eject(missingCreditsInterceptor)
    }
  }, [])

  return (
    <BillingContext.Provider
      value={{
        missingCredits,
        setMissingCredits,
      }}
    >
      <InsufficientCreditsPopup />
      {props.children}
    </BillingContext.Provider>
  )
}

export function useBilling() {
  const context = React.useContext(BillingContext)
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider')
  }

  return context
}

function isCreditsError(error: {type: string}): error is CreditsError {
  return error.type === 'insufficient_credits'
}
