import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import {Dashboard} from 'Event/Dashboard'
import DashboardTemplateSelect from 'Event/Dashboard/Template/DashboardTemplateSelect'
import {createDashboard} from 'Event/state/actions'
import {spacing} from 'lib/ui/theme'
import Page from 'organization/user/Layout/Page'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

export default function CreateDashboardForm() {
  const [template, setTemplate] = useState<Dashboard['template'] | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!template) {
      return
    }

    dispatch(createDashboard(template))
  }, [template, dispatch])

  return (
    <Page>
      <Description>Pick a template below to get started...</Description>
      <DashboardTemplateSelect value={template} onPick={setTemplate} />
    </Page>
  )
}

const Description = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Typography)
