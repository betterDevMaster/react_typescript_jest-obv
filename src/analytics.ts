import {useEvent} from 'Event/EventProvider'
import {isTest} from 'env'
import {useEffect} from 'react'
import ReactGA from 'react-ga'

/**
 * At the time of implementaiton 'react-ga- only supported the older
 * UA implementation and not Google analtyics 4.
 */
const GA_PROPERTY_ID = 'UA-193332349-1'

export function useAnalytics() {
  useEffect(() => {
    if (isTest) {
      return
    }

    ReactGA.initialize(GA_PROPERTY_ID)

    /**
     * Track Load Performance
     */

    const callback: PerformanceObserverCallback = (list) => {
      list.getEntries().forEach((entry: any) => {
        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Server Latency',
          value: entry.responseStart - entry.requestStart,
        })

        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Download Time',
          value: entry.responseEnd - entry.responseStart,
        })

        ReactGA.timing({
          category: 'Load Performace',
          variable: 'Total App Load',
          value: entry.responseEnd - entry.requestStart,
        })
      })
    }

    const loadObserver = new PerformanceObserver(callback)
    loadObserver.observe({entryTypes: ['navigation']})
  }, [])
}

/**
 * Record a page view in analytics
 */
export function usePageView(page?: string) {
  useEffect(() => {
    if (isTest) {
      return
    }

    const url = window.location.pathname + window.location.search
    const location = page || url
    ReactGA.pageview(location)
  }, [page])
}

/**
 * Send an event to Google Analytics
 * @returns
 */
export function useTrackOnLoad(data: {
  category: string
  action: string
  label?: string
  value?: number
}) {
  useEffect(() => {
    if (isTest) {
      return
    }

    ReactGA.event(data)
  }, [data])
}

export function useTrackEventPage(data: {
  page: string
  details?: string
  value?: number
}) {
  const {event} = useEvent()
  const {page, details, value} = data

  useTrackOnLoad({
    category: `Event - ${event.name} (${event.slug})`,
    action: page,
    label: details,
    value,
  })
}

export function sendTiming(data: {
  category: string
  variable: string
  value: number
  label?: string
}) {
  if (isTest) {
    return
  }

  ReactGA.timing(data)
}
