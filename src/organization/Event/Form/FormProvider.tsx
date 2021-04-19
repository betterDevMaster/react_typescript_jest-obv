import {api} from 'lib/url'
import {useEventRoutes} from 'organization/Event/EventRoutes'
import {Form, useForms} from 'organization/Event/FormsProvider'
import Page from 'organization/Event/Page'
import {useOrganization} from 'organization/OrganizationProvider'
import Layout from 'organization/user/Layout'
import React, {useCallback, useEffect, useState} from 'react'
import {Redirect, useParams} from 'react-router-dom'

type FormContextProps = {
  form: Form
  update: <T extends keyof Pick<Form, 'name'>>(key: T) => (val: Form[T]) => void
  processing: boolean
}

const FormContext = React.createContext<FormContextProps | undefined>(undefined)

export function FormProvider(props: {children: React.ReactElement}) {
  const {form: routeId} = useParams<{form: string}>()
  const id = parseInt(routeId)
  const [form, setForm] = useState<Form | null>(null)
  const {update, processing} = useUpdateForm(id)
  const {forms} = useForms()
  const [loading, setLoading] = useState(true)
  const eventRoutes = useEventRoutes()

  useEffect(() => {
    const target = forms.find((f) => f.id === id)

    if (target) {
      setForm(target)
    }

    setLoading(false)
  }, [id, forms])

  if (loading) {
    return (
      <Layout>
        <Page>
          <div>loading...</div>
        </Page>
      </Layout>
    )
  }

  if (!form) {
    return <Redirect to={eventRoutes.forms.root} />
  }

  return (
    <FormContext.Provider value={{form, update, processing}}>
      {props.children}
    </FormContext.Provider>
  )
}

function useUpdateForm(id: number) {
  const {client} = useOrganization()
  const [processing, setProcessing] = useState(false)
  const {update: updateForm} = useForms()

  const update = useCallback(
    <T extends keyof Form>(key: T) => {
      const url = api(`/forms/${id}`)
      return (value: Form[T]) => {
        if (processing) {
          return
        }

        setProcessing(true)
        client
          .patch<Form>(url, {[key]: value})
          .then(updateForm)
          .finally(() => {
            setProcessing(false)
          })
      }
    },
    [client, id, processing, updateForm],
  )

  return {processing, update}
}

export function useForm() {
  const context = React.useContext(FormContext)
  if (context === undefined) {
    throw new Error('useEventForm must be used within a FormProvider')
  }

  return context
}
