import React, {useCallback, useEffect, useState} from 'react'

export interface Breadcrumb {
  title: string
  url: string
}

export interface BreadcrumbContextProps {
  breadcrumbs: Breadcrumb[]
  set: (breadcrumbs: Breadcrumb[]) => void
  clear: () => void
}

const BreadcrumbContext =
  React.createContext<BreadcrumbContextProps | undefined>(undefined)

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

  useEffect(() => {
    if (!breadcrumbs || !set || !clear) {
      return
    }
    set(breadcrumbs)

    // Clear when navigating to another page
    return clear

    /**
     * Only want to set on first call to let last call win. If we
     * re-set on every breadcrumbs change, we would get a loop
     * when a parent, and child both set the breadcrumbs.
     */
    // eslint-disable-next-line
  }, [])

  if (context === undefined) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider')
  }

  return context
}
