import React, {useEffect} from 'react'
import SimpleBlogDashboard from 'Event/template/SimpleBlog/Dashboard'
import {User} from 'auth/user'
import ConfigBar from 'Event/Dashboard/editor/views/ConfigBar'
import {useTemplate} from 'Event/TemplateProvider'
import {useDispatch} from 'react-redux'
import {setEditMode} from 'Event/Dashboard/editor/state/actions'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import PanelsDashboard from 'Event/template/Panels/Dashboard'

export type DashboardProps = {
  isEditMode?: boolean
  user: User
}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setEditMode(props.isEditMode || false))
  }, [props.isEditMode, dispatch])

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
    default:
      throw new Error(`Missing dashboard for template: ${name}`)
  }
}
