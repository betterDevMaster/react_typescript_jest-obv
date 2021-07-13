import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {usePoints} from 'Event/PointsProvider'
import React, {useEffect, useState} from 'react'

export const DASHBOARD = 'DASHBOARD'
export const SPEAKERS = 'SPEAKERS'
export const SPONSORS = 'SPONSORS'
export const LEADERBOARD = 'LEADERBOARD'

export type Page =
  | typeof DASHBOARD
  | typeof SPEAKERS
  | typeof SPONSORS
  | typeof LEADERBOARD

/**
 * Awards user points when accessing certain pages.
 *
 * @param props
 */
export default function PagePoints(props: {
  children: React.ReactElement
  page: Page
}) {
  const {submit} = usePoints()
  const action = usePageAction(props.page)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!action || submitted) {
      return
    }
    setSubmitted(true)

    submit(action)
  }, [action, submit, submitted, setSubmitted])

  return props.children
}

function usePageAction(page: string) {
  const action = usePlatformActions()

  switch (page) {
    case DASHBOARD:
      return action.visitDashboard
    case SPEAKERS:
      return action.visitSpeakers
    case SPONSORS:
      return action.visitSponsors
    case LEADERBOARD:
      return action.visitLeaderboard
    default:
      return null
  }
}
