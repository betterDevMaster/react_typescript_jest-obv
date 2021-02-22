import {Action, ActionsContext, useActionsList} from 'Event/ActionsProvider'
import React, {useCallback} from 'react'

export default function StaticActionsProvider(props: {
  actions: Action[]
  children: React.ReactElement | React.ReactElement[]
}) {
  const list = useActionsList(
    useCallback(() => Promise.resolve(props.actions), [props.actions]),
  )

  return (
    <ActionsContext.Provider value={list}>
      {props.children}
    </ActionsContext.Provider>
  )
}
