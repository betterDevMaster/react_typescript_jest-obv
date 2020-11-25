import {Groups, Tags} from 'Event/attendee'
import React from 'react'

interface AttendeeProfileProps {
  groups: Groups
  tags: Tags
}

const AttendeeProfileContext = React.createContext(
  (undefined as unknown) as AttendeeProfileProps,
)

export default function AttendeeProfileProvider(props: {
  children: React.ReactNode
  groups: Groups
  tags: Tags
}) {
  return (
    <AttendeeProfileContext.Provider
      value={{
        groups: props.groups,
        tags: props.tags,
      }}
    >
      {props.children}
    </AttendeeProfileContext.Provider>
  )
}

export function useAttendeeProfile() {
  const context = React.useContext(AttendeeProfileContext)
  if (context === undefined) {
    throw new Error(
      'useAttendeeProfile must be used within a AttendeeProfileProvider',
    )
  }

  return context
}
