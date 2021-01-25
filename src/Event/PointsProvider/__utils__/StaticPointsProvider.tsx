import {Action} from 'Event/ActionsProvider'
import {
  PointsContext,
  Score,
  useAttendeeScore,
  useShowReceived,
} from 'Event/PointsProvider'
import React, {useCallback} from 'react'

export const defaultScore: Score = {
  points: 0,
  position: 1,
}

export default function StaticPointsProvider(props: {
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
