import React, {useCallback, useState} from 'react'
import SimpleBlogReportsConfig from 'Event/template/SimpleBlog/Reports/ReportsConfig'
import Layout from 'organization/user/Layout'
import Page from 'organization/Event/Page'
import {useTemplate} from 'Event/TemplateProvider'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {Report, useReports} from 'organization/Event/ReportsProvider'
import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'

export type ReportUpdate = Partial<
  Omit<Report, 'forms'> & {
    /**
     * Only send over form ids of the forms to be included
     */
    forms: number[]
  }
>

interface ReportsConfigContextProps {
  report: Report
  update: (updates: FormData | ReportUpdate) => Promise<void>
  processing: boolean
}

const ReportsConfigContext = React.createContext<
  undefined | ReportsConfigContextProps
>(undefined)

export default function ReportsConfig() {
  const {loading, editing: report} = useReports()

  const {update, processing} = useUpdate()

  if (loading || !report) {
    return <FullPageLoader />
  }

  return (
    <Layout>
      <Page>
        <ReportsConfigContext.Provider
          value={{
            report,
            update: update(report),
            processing,
          }}
        >
          <TemplateReports />
        </ReportsConfigContext.Provider>
      </Page>
    </Layout>
  )
}

function TemplateReports() {
  const template = useTemplate()
  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogReportsConfig />
    default:
      throw new Error(`Missing ReportsConfig for template: ${template.name}`)
  }
}

export function useReportsConfig() {
  const context = React.useContext(ReportsConfigContext)
  if (context === undefined) {
    throw new Error('useReportsConfig must be used within a ReportsConfig')
  }

  return context
}

function useUpdate() {
  const {client} = useOrganization()
  const {set} = useReports()
  const [processing, setProcessing] = useState(false)

  const update = useCallback(
    (target: Report) => (data: FormData | ReportUpdate) => {
      if (processing) {
        return Promise.reject(
          'Processing, could not update report; did you forget to check for processing?',
        )
      }

      setProcessing(true)
      const url = api(`/reports/${target.id}`)

      return client
        .patch<Report>(url, data)
        .then(set)
        .finally(() => {
          setProcessing(false)
        })
    },
    [client, set, processing],
  )

  return {processing, update}
}
