import {Action} from 'Event/ActionsProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'

export interface Score {
  points: number
  position: number
}

export interface PointsContextProps {
  showReceived: (action: Action) => void
  submit: (action: Action | null) => void
  score: Score
}

export const PointsContext = React.createContext<
  PointsContextProps | undefined
>(undefined)

export function PointsProvider(props: {children: React.ReactElement}) {
  const {client, event} = useEvent()
  const fetchScore = useFetchScore()
  const {score, add} = useAttendeeScore(fetchScore)
  const showReceived = useShowReceived()

  const submit = useCallback(
    (action: Action | null) => {
      if (!action) {
        return
      }

      const url = api(`/events/${event.slug}/actions/${action.id}`)

      client
        .post(url)
        .then(() => {
          showReceived(action)
          add(action.points)
        })
        .catch((e) => {
          /**
           *  Ignore errors as these could be for valid reasons:
           * - Reached limits
           * - Inactive actions
           */
        })
    },
    [client, event.slug, showReceived, add],
  )

  return (
    <PointsContext.Provider value={{showReceived, submit, score}}>
      {props.children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = React.useContext(PointsContext)
  if (context === undefined) {
    throw new Error(`usePoints must be used within a PointsProvider`)
  }

  return context
}

export function useShowReceived() {
  const {enqueueSnackbar} = useSnackbar()
  return useCallback(
    (action: Action) => {
      const text = rewardText(action)
      enqueueSnackbar(text, {variant: 'success'})
    },
    [enqueueSnackbar],
  )
}

function rewardText(action: Action) {
  return `Yay! You have received ${action.points} points for ${action.description}`
}

function useFetchScore() {
  const {event, client} = useEvent()
  const url = api(`/events/${event.slug}/score`)

  return useCallback(() => client.get<Score>(url), [client, url])
}

export function useAttendeeScore(fetch: () => Promise<Score>) {
  const [score, setScore] = useState<Score>({points: 0, position: 0})

  const {data: saved} = useAsync(fetch)

  useEffect(() => {
    if (!saved) {
      return
    }

    setScore(saved)
  }, [saved])

  const add = (points: number) => {
    const added = {
      ...score,
      points: score.points + points,
    }

    setScore(added)
  }

  return {score, add}
}
