import {useEffect} from 'react'
import ReactGA from 'react-ga'

/**
 * At the time of implementaiton 'react-ga- only supported the older
 * UA implementation and not Google analtyics 4.
 */
const GA_PROPERTY_ID = 'UA-193332349-1'

export function useAnalytics() {
  useEffect(() => {
    ReactGA.initialize(GA_PROPERTY_ID)
  }, [])
}

/**
 * Record a page view in analytics
 */
export function usePageView() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
}
