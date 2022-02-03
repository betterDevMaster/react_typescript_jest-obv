import React from 'react'
import {OwnerContext} from 'organization/OwnerProvider'
import {TeamMember} from 'auth/user'

export default function StaticOwnerProvider(props: {
  owner: TeamMember
  children: React.ReactNode
}) {
  return (
    <OwnerContext.Provider
      value={{
        owner: props.owner,
        setOwner: () => {},
      }}
    >
      {props.children}
    </OwnerContext.Provider>
  )
}
