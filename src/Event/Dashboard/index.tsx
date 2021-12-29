import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {User} from 'auth/user'

import {useCheckIn} from 'Event/attendee'
import ConfigBar from 'Event/Dashboard/editor/views/ConfigBar'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {useTemplate} from 'Event/TemplateProvider'

import SimpleBlogDashboard from 'Event/template/SimpleBlog/Dashboard'
import PanelsDashboard from 'Event/template/Panels/Dashboard'
import CardsDashboard from 'Event/template/Cards/Dashboard'
import NiftyFiftyDashboard from 'Event/template/NiftyFifty/Dashboard'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {CARDS} from 'Event/template/Cards'
import {NIFTY_FIFTY} from 'Event/template/NiftyFifty'

export type DashboardProps = {
  isEditMode?: boolean
  user: User
}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode || false))
  }, [props.isEditMode, dispatch])

  useCheckIn(props.user)

  return (
    <ConfigComponents isEditMode={props.isEditMode}>
      <TemplateDashboard user={props.user} />
    </ConfigComponents>
  )
}

function ConfigComponents(props: {
  isEditMode?: boolean
  children: React.ReactElement
}) {
  if (props.isEditMode) {
    return (
      <>
        <ConfigBar />
        {props.children}
      </>
    )
  }

  return props.children
}

function TemplateDashboard(props: {user: User}) {
  const {name} = useTemplate()

  switch (name) {
    case SIMPLE_BLOG:
      return <SimpleBlogDashboard user={props.user} />
    case PANELS:
      return <PanelsDashboard user={props.user} />
    case CARDS:
      return <CardsDashboard user={props.user} />
    case NIFTY_FIFTY:
      return <NiftyFiftyDashboard user={props.user} />
    default:
      throw new Error(`Missing dashboard for template: ${name}`)
  }
}
