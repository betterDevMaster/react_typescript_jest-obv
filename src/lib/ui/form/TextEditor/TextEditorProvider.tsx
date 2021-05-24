import React, {useCallback} from 'react'
import {api} from 'lib/url'
import {useAsync} from 'lib/async'
import {useOrganization} from 'organization/OrganizationProvider'

/**
 * CK Editor upload URL
 */
const uploadUrl = process.env.REACT_APP_CK_EDITOR_UPLOAD_URL

export type TextEditorContextPropos = {
  ckToken: string
  ckUploadUrl: string
}

type TextEditorContextProps = TextEditorContextPropos

const TextEditorContext =
  React.createContext<TextEditorContextProps | undefined>(undefined)

export default function TextEditorProvider(props: {children: React.ReactNode}) {
  const {loading, token} = useAccessToken()

  if (loading) {
    return null
  }

  if (!token) {
    throw new Error(
      'Missing access token for CKEditor; did fetching a token from API fail?',
    )
  }

  if (!uploadUrl) {
    throw new Error(
      'Missing upload URL for CKEditor; did you forget to set one in env?',
    )
  }

  return (
    <TextEditorContext.Provider
      value={{
        ckToken: token,
        ckUploadUrl: uploadUrl,
      }}
    >
      {props.children}
    </TextEditorContext.Provider>
  )
}

export function useTextEditor() {
  const context = React.useContext(TextEditorContext)
  if (context === undefined) {
    throw new Error(`useTextEditor must be used within a TextEditorProvider`)
  }
  return context
}

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
