import {Action} from 'Event/ActionsProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {useSnackbar} from 'notistack'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export interface Score {
  points: number
  position: number
}

export const defaultScore: Score = {
  points: 0,
  position: 1,
}

export interface PointsContextProps {
  showReceived: (action: Action, unit: string) => void
  submit: (action: Action | null) => void
  score: Score
}

export const PointsContext = React.createContext<
  PointsContextProps | undefined
>(undefined)

export default function PointsProvider(props: {children: React.ReactElement}) {
  const {client, event} = useEvent()
  const unit = event.template?.points?.unit
  const fetchScore = useFetchScore()
  const {score, add} = useAttendeeScore(fetchScore)
  const showReceived = useShowReceived()
  const isEditMode = useEditMode()

  const submit = useCallback(
    (action: Action | null) => {
      if (!action || isEditMode) {
        return
      }

      const url = api(`/events/${event.slug}/actions/${action.key}`)

      client
        .post(url)
        .then(() => {
          showReceived(action, unit || null)
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
    [client, event.slug, showReceived, add, isEditMode, unit],
  )

  return (
    <PointsContext.Provider value={{showReceived, submit, score}}>
      {props.children}
    </PointsContext.Provider>
  )
}

export function StaticPointsProvider(props: {
  children: React.ReactElement
  score?: Score
}) {
  const fetchScore = useCallback(
    () => Promise.resolve(props.score || defaultScore),
    [props.score],
  )
  const {score, add} = useAttendeeScore(fetchScore)
  const showReceived = useShowReceived()

  const submit = useCallback(
    (action: Action | null) => {
      if (!action) {
        return
      }

      add(action.points)
    },
    [add],
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
    (action: Action, unit: string | null) => {
      const text = rewardText(action, unit)
      enqueueSnackbar(text, {variant: 'success'})
    },
    [enqueueSnackbar],
  )
}

function rewardText(action: Action, unit: string | null) {
  return `Yay! You have received ${action.points} ${unit || 'points'} for ${
    action.description
  }`
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
