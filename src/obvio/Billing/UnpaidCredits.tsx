import {useAsync} from 'lib/async'
import styled from 'styled-components'
import {api} from 'lib/url'
import {useObvioUser} from 'obvio/auth'
import {teamMemberClient} from 'obvio/obvio-client'
import React, {useCallback} from 'react'

export default function UnpaidCredits() {
  const user = useObvioUser()

  if (!user.has_unpaid_transactions) {
    return null
  }

  return <UnpaidCreditsText />
}

function UnpaidCreditsText() {
  const {data} = useUnpaidCredits()

  if (!data) {
    return null
  }

  return <Text>*You have {data.num_unpaid_credits} unpaid credits.</Text>
}
function useUnpaidCredits() {
  const url = api(`/unpaid_credits`)

  const request = useCallback(
    () => teamMemberClient.get<{num_unpaid_credits: number}>(url),
    [url],
  )

  return useAsync(request)
}

const Text = styled.p`
  color: ${(props) => props.theme.colors.error};
  margin-top: ${(props) => props.theme.spacing[5]};
`
