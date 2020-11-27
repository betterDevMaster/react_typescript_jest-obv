import {Groups, Tags} from 'Event/attendee'
import React from 'react'

interface AttendeeProfileProps {
  groups: Groups
  tags: Tags
}

const AttendeeProfileContext = React.createContext(
  (undefined as unknown) as AttendeeProfileProps,
)

/**
 * Provide Attendee specific information. These are passed explicitly
 * instead of directly referencing the currently authenticated user
 * to allow mocking values when configuring a dashboard.
 *
 * @param props
 */
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
