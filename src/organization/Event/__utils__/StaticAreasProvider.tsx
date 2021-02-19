import {Area, AreasContext} from 'organization/Event/AreasProvider'
import React from 'react'

export default function StaticAreasProvider(props: {
  children: React.ReactElement
  areas: Area[]
}) {
  return (
    <AreasContext.Provider
      value={{
        areas: props.areas,
        loading: false,
      }}
    >
      {props.children}
    </AreasContext.Provider>
  )
}
