import {useEvent} from 'Event/EventProvider'
import {Question} from 'organization/Event/QuestionsProvider'
import React from 'react'

export interface Form {
  id: number
  name: string
  questions: Question[]
}

export interface FormsContextProps {
  forms: Form[]
  add: (form: Form) => void
  update: (form: Form) => void
  remove: (form: Form) => void
}

export const FormsContext = React.createContext<FormsContextProps | undefined>(
  undefined,
)

export default function FormsProvider(props: {children: React.ReactElement}) {
  const {event, update: updateEvent} = useEvent()

  const setForms = (forms: Form[]) => {
    updateEvent({
      ...event,
      forms,
    })
  }

  const add = (form: Form) => {
    const added = [...event.forms, form]
    setForms(added)
  }

  const update = (target: Form) => {
    const updated = event.forms.map((f) => {
      const isTarget = f.id === target.id
      if (isTarget) {
        return target
      }

      return f
    })

    setForms(updated)
  }

  const remove = (target: Form) => {
    const remaining = event.forms.filter((f) => f.id !== target.id)
    setForms(remaining)
  }

  return (
    <FormsContext.Provider value={{forms: event.forms, add, update, remove}}>
      {props.children}
    </FormsContext.Provider>
  )
}

export function useForms() {
  const context = React.useContext(FormsContext)
  if (context === undefined) {
    throw new Error(`useForms must be used within a FormsProvider`)
  }

  return context
}
