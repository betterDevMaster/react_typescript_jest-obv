import React, {useEffect, useState} from 'react'
import AccessTokenSelect, {
  useSetAccessToken,
} from 'organization/Event/Services/Apps/Mailchimp/Config/AccessTokenSelect'
import {useAccessTokens} from 'organization/Event/Services/AccessTokens/AccessTokensProvider'
import {useMailchimp} from 'organization/Event/Services/Apps/Mailchimp'

/**
 * Access token config will auto create/select a token for the
 * user in certain cases (ie. only 1 available token).
 *
 * @returns
 */
export default function AccessTokenAutoSelect() {
  const [loading, setLoading] = useState(true)
  const {setToken, processing: processingSet} = useSetAccessToken()
  const {tokens, processing: processingList, addToken} = useAccessTokens()
  const {access_token_id} = useMailchimp()

  const numTokens = tokens.length
  const hasTokens = numTokens > 0
  const hasMultipleTokens = numTokens > 1

  const alreadySelected = Boolean(access_token_id)

  /**
   * Auto-select a token if it's the only one
   */
  useEffect(() => {
    if (processingSet) {
      // Already selecting something
      return
    }

    if (alreadySelected) {
      return
    }

    if (hasMultipleTokens) {
      // If there are multiple tokens, let the user choose one
      return
    }

    if (!hasTokens) {
      // No token to auto-select
      return
    }

    setToken(tokens[0].id)
  }, [
    processingSet,
    tokens,
    setToken,
    hasMultipleTokens,
    hasTokens,
    alreadySelected,
  ])

  /**
   * Auto-create a single token if none exist
   */
  useEffect(() => {
    if (processingList) {
      // Already modifying tokens
      return
    }

    if (alreadySelected) {
      return
    }

    if (hasTokens) {
      return
    }

    addToken()
  }, [alreadySelected, tokens, addToken, processingList, hasTokens])

  /**
   * Determine when auto-config process has finished 'loading'.
   */

  useEffect(() => {
    if (loading) {
      // already done
      return
    }

    if (alreadySelected) {
      setLoading(false)
      return
    }

    if (hasMultipleTokens) {
      setLoading(false)
      return
    }
  }, [loading, alreadySelected, hasMultipleTokens])

  if (loading) {
    return null
  }

  return <AccessTokenSelect />
}
