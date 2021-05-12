import React, {useState} from 'react'
import {Button} from '@material-ui/core'
import {useEvent} from 'Event/EventProvider'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {FAQ} from 'Event/FaqPage'

export interface AddFaqData {
  question: string
  answer: string
}

const DEFAULT_QUESTION = 'Question'
const DEFAULT_ANSWER = 'Answer'

export default function AddFaqButton(props: {
  className?: string
  onAdd: (Faq: FAQ) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const addFaq = useAddFaq()

  const add = () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    addFaq()
      .then(props.onAdd)
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Button
      fullWidth
      className={props.className}
      size="large"
      variant="contained"
      color="secondary"
      aria-label="add faq"
      onClick={add}
      disabled={submitting}
    >
      Add Faq
    </Button>
  )
}

function useAddFaq() {
  const {event} = useEvent()
  const {client} = useOrganization()
  const url = api(`/events/${event.slug}/faqs`)

  const data: AddFaqData = {
    question: DEFAULT_QUESTION,
    answer: DEFAULT_ANSWER,
  }

  return () => client.post<FAQ>(url, data)
}
