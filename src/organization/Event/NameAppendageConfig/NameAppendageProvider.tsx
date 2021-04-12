import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React from 'react'
import {useCallback} from 'react'

export interface NameAppendage {
    created_at: string
    appendage_text: string
    appendage_emoji: string
    rules: string
    order: number
    id: number
}

export interface NameAppendageContextProps {
    name_appendages: NameAppendage[]
    loading: boolean
}

export const NameAppendageContext = React.createContext<
    NameAppendageContextProps | undefined
    >(undefined)

export default function NameAppendageProvider(props: {children: React.ReactElement}) {
    const fetch = useFetchNameAppedange()

    const {data: name_appendages, loading} = useAsync(fetch)

    if (loading || !name_appendages) {
        return <div>loading...</div>
    }

    return (
        <NameAppendageContext.Provider
            value={{
                name_appendages,
                loading,
            }}
        >
            {props.children}
        </NameAppendageContext.Provider>
    )
}

export function useFetchNameAppedange() {
    const {client} = useOrganization()
    const {event} = useEvent()
    const {slug} = event

    return useCallback(() => {
        const url = api(`/events/${slug}/name-appendage/list`)
        return client.get<NameAppendage[]>(url)
    }, [client, slug])
}

export function useNameAppendages() {
    const context = React.useContext(NameAppendageContext)
    if (context === undefined) {
        throw new Error('useNameAppendages must be used within an NameAppendageProvider')
    }

    return context
}