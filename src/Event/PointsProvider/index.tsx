import {Action} from 'Event/ActionsProvider'
import React, {useCallback, useEffect, useState} from 'react'
import {api} from 'lib/url'
import {useEvent} from 'Event/EventProvider'
import {useAsync} from 'lib/async'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {replace} from 'lib/template'
import {useSnackbar} from 'lib/ui/SnackbarProvider'
import {useTemplate} from 'Event/TemplateProvider'
import {DEFAULT_POINTS_UNIT} from 'Event/template/SimpleBlog/Dashboard/PointsSummary/SetPointsButton'

export const DEFAULT_REWARD_TEXT = `Yay! You have received {{action_points}} {{points_unit}} for {{action_description}}.`
export const DEFAULT_REWARD_ALERT_BACKGROUND_COLOR = '#565656'
export const DEFAULT_REWARD_ALERT_TEXT_COLOR = '#ffffff'

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
    [isEditMode, event.slug, client, showReceived, unit, add],
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
  const {enqueueSnackbar, setBackgroundColor, setTextColor} = useSnackbar()
  const withActionVariables = useWithActionVariables()
  const {event} = useEvent()

  const template = useTemplate()
  const rewardText = event.template?.rewardAlert?.text || DEFAULT_REWARD_TEXT

  /**
   * Customize snackbar colors
   */
  useEffect(() => {
    setBackgroundColor(template.rewardAlert?.backgroundColor)
    setTextColor(template.rewardAlert?.textColor)
  }, [template, setBackgroundColor, setTextColor])

  return useCallback(
    (action: Action, unit: string | null) => {
      const text = withActionVariables(rewardText, action, unit)
      enqueueSnackbar(text, {variant: 'success'})
    },
    [enqueueSnackbar, rewardText, withActionVariables],
  )
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

/**
 * Replaces given text with action, and point variables.
 *
 * @returns
 */
function useWithActionVariables() {
  return useCallback((text: string, action: Action, unit: string | null) => {
    if (!text) {
      return text
    }

    const values = {
      action_description: action.description,
      action_points: action.points,
      points_unit: unit || DEFAULT_POINTS_UNIT,
    }

    let result = text

    for (const [key, value] of Object.entries(values)) {
      result = replace(key, String(value), result)
    }

    return result
  }, [])
}
