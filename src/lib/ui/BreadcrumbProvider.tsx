import React, {useCallback, useEffect, useMemo, useState} from 'react'

export interface Breadcrumb {
  title: string
  url: string
}

export interface BreadcrumbContextProps {
  breadcrumbs: Breadcrumb[]
  set: (breadcrumbs: Breadcrumb[]) => void
  clear: () => void
}

const BreadcrumbContext = React.createContext<
  BreadcrumbContextProps | undefined
>(undefined)

export default function BreadcrumbProvider(props: {children: React.ReactNode}) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  const clearBreadcrumbs = useCallback(() => setBreadcrumbs([]), [])

  return (
    <BreadcrumbContext.Provider
      value={{breadcrumbs, set: setBreadcrumbs, clear: clearBreadcrumbs}}
    >
      {props.children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumbs(breadcrumbs?: Breadcrumb[]) {
  const context = React.useContext(BreadcrumbContext)
  const set = context?.set
  const clear = context?.clear

  // Prevent render loop by only setting breadcrumb on first call
  // eslint-disable-next-line
  const memoized = useMemo(() => breadcrumbs || [], [])

  useEffect(() => {
    if (!breadcrumbs || !set || !clear) {
      return
    }

    set(memoized)

    // Clear when navigating to another page
    return clear
  }, [memoized, set, clear, breadcrumbs])

  if (context === undefined) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider')
  }

  return context.breadcrumbs
}
