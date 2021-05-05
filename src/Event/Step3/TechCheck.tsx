import React, {useEffect} from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {useAttendee, useEventAuth} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {TechCheckConfig} from 'Event'
import SimpleBlogTechCheck from 'Event/template/SimpleBlog/TechCheck'
import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {usePoints} from 'Event/PointsProvider'
import {Template} from 'Event/template'

const TECH_CHECK_POLL_SECS = 10

export interface TechCheckProps {
  techCheck: TechCheckConfig
  progress: number
  techCheckTemplate: Template['techCheck']
  isPreview: boolean
}

export default function TechCheck() {
  const {event} = useEvent()
  const {tech_check: techCheck} = event
  const attendee = useEventAuth()
  const {completeCheckIn} = usePlatformActions()
  const {submit: submitAction} = usePoints()
  const template = useTemplate()
  const user = useAttendee()

  useEffect(() => {
    const pollTimer = setInterval(attendee.refresh, TECH_CHECK_POLL_SECS * 1000)

    return () => {
      clearInterval(pollTimer)
    }
  }, [attendee])

  /**
   * Only want to submit action once: on completing tech-check.
   * ie. when this component unloads, so we'll explicitly
   * ignore all other dependencies.
   */
  useEffect(() => {
    return () => {
      submitAction(completeCheckIn)
    }
    // eslint-disable-next-line
  }, [])

  if (!techCheck) {
    throw new Error(`Missing event tech check`)
  }

  switch (template.name) {
    case SIMPLE_BLOG:
      return (
        <SimpleBlogTechCheck
          user={user}
          techCheck={techCheck}
          progress={75}
          isPreview={false}
          techCheckTemplate={template.techCheck}
        />
      )
    default:
      throw new Error(`Missing tech check for template: ${template.name}`)
  }
}
