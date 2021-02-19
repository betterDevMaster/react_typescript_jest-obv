import React from 'react'
import Card from 'organization/Event/AreaList/Card'
import {useAreas} from 'organization/Event/AreasProvider'

export default function AreaList() {
  const {areas, loading} = useAreas()

  if (loading || !areas) {
    return <div>loading...</div>
  }

  const isEmpty = areas.length === 0
  if (isEmpty) {
    return <div>You have not created any areas</div>
  }

  return (
    <div>
      {areas.map((a) => (
        <Card key={a.id} area={a} />
      ))}
    </div>
  )
}
