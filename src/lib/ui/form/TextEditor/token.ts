import {useCallback} from 'react'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import {useOrganization} from 'organization/OrganizationProvider'

export function useAccessToken() {
  const {client} = useOrganization()

  const fetch = useCallback(() => {
    const url = api('/ckeditor/token')
    return client.get<{token: string}>(url)
  }, [client])

  const {loading, data} = useAsync(fetch)

  return {
    loading,
    token: data?.token || null,
  }
}
