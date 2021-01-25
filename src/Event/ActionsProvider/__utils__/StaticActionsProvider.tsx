import {
  Action,
  ActionsContext,
  useActionsList,
} from 'Event/ActionsProvider'
import React, {useCallback} from 'react'

export default function StaticActionsProvider(props: {
  actions: {
    platform: Action[]
    custom: Action[]
  }
  children: React.ReactElement | React.ReactElement[]
}) {
  const platform = useActionsList(
    useCallback(() => Promise.resolve(props.actions.platform), [
      props.actions.platform,
    ]),
  )

  const custom = useActionsList(
    useCallback(() => Promise.resolve(props.actions.custom), [
      props.actions.custom,
    ]),
  )

  return (
    <ActionsContext.Provider
      value={{
        platform,
        custom,
      }}
    >
      {props.children}
    </ActionsContext.Provider>
  )
}
