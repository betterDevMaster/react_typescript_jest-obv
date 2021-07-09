import React, {useEffect} from 'react'
import moment from 'moment'

export interface LocalizationContextProps {
  locale: string
  has12HourTime: boolean
  dateTimeFormat: string
}

const LocalizationContext = React.createContext<
  LocalizationContextProps | undefined
>(undefined)

export default function LocalizationProvider(props: {
  children: React.ReactNode
}) {
  const locale = window.navigator.language

  // Only show 12 hour time format for English locales
  const has12HourTime = /en-/.test(locale)

  const dateTimeFormat = has12HourTime ? 'Do MMMM h:mma' : 'Do MMMM HH:MM'

  useEffect(() => {
    moment.locale([locale, 'en-US'])
  }, [locale])

  return (
    <LocalizationContext.Provider
      value={{
        locale,
        has12HourTime,
        dateTimeFormat,
      }}
    >
      {props.children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = React.useContext(LocalizationContext)

  if (context === undefined) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider',
    )
  }

  return context
}
