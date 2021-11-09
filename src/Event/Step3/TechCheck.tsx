import React, {useEffect} from 'react'
import {useTemplate} from 'Event/TemplateProvider'
import {useEvent} from 'Event/EventProvider'
import {useAttendee, useEventAuth} from 'Event/auth'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {PANELS} from 'Event/template/Panels'
import {TechCheckConfig} from 'Event'
import SimpleBlogTechCheck from 'Event/template/SimpleBlog/Step3/TechCheck'
import PanelsTechCheck from 'Event/template/Panels/Step3/TechCheck'
import CardsTechCheck from 'Event/template/Cards/Step3/TechCheck'

import {usePlatformActions} from 'Event/ActionsProvider/platform-actions'
import {usePoints} from 'Event/PointsProvider'
import {User} from 'auth/user'
import {CARDS} from 'Event/template/Cards'

const TECH_CHECK_POLL_SECS = 10

export type TechCheckProps = {
  user: User
  techCheck: TechCheckConfig
  progress: number
  isPreview: boolean

  /**
   * Accepting the current template settings is required
   * to render the config preview before saving.
   */
  settings: any
}

export default function TechCheck() {
  const {event} = useEvent()
  const {tech_check: techCheck} = event
  const attendee = useEventAuth()
  const {completeCheckIn} = usePlatformActions()
  const {submit: submitAction} = usePoints()
  const template = useTemplate()
  const user = useAttendee()
  const progress = useStep3Progress()

  /**
   * Poll to check if attendee has been marked as tech check completed.
   */
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

  const props = {
    user,
    techCheck,
    progress,
    isPreview: false,
    settings: template.techCheck,
  }

  switch (template.name) {
    case SIMPLE_BLOG:
      return <SimpleBlogTechCheck {...props} />
    case PANELS:
      return <PanelsTechCheck {...props} />
    case CARDS:
      return <CardsTechCheck {...props} />
    default:
      throw new Error(`Missing tech check for template`)
  }
}

function useStep3Progress() {
  const {hasWaiver} = useEvent()
  if (hasWaiver) {
    return 75
  }

  return 67
}
