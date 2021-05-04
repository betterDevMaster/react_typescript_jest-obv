import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {api} from 'lib/url'
import {ObvioEvent} from 'Event'
import {setEvent} from 'Event/state/actions'
import {teamMemberClient as client} from 'obvio/obvio-client'
import {useDispatch} from 'react-redux'
import {useEvent, useUpdate} from 'Event/EventProvider'
import {createSimpleBlog} from 'Event/template/SimpleBlog'
import {useTemplate} from 'Event/TemplateProvider'

export type Background = {
  id: number
  image: {
    name: string
    url: string
  }
  event_id: number
  created_at: string
  updated_at: string
}

export interface BackgroundsResponseData {
  zoom_backgrounds_title: string
  zoom_backgrounds_description: string
  zoom_backgrounds: string[]
}

export type BackgroundsData = {
  zoom_backgrounds_title: string
  zoom_backgrounds_description: string
}

export type BackgroundsTemplateData = {
  borderColor: string
  borderRadius: number
  borderThickness: number
  imagesPerRow: number
  description: {
    color: string
    fontSize: number
  }
}

export interface BackgroundsContextProps {
  backgrounds: Background[]
  isRemoving: boolean
  isSubmitting: boolean
  isUploading: boolean
  loading: boolean
  error: string
  requestError: string
  backgroundsTemplateData: BackgroundsTemplateData
  setError: (error: string) => void
  clearError: () => void
  clearRequestError: () => void
  uploadBackground: (data: FormData) => Promise<any>
  removeBackground: (id: number) => void
  setBackgroundData: (
    data: BackgroundsData,
    dataTemplate: BackgroundsTemplateData,
  ) => Promise<any>
}

const BackgroundsContext = React.createContext<
  BackgroundsContextProps | undefined
>(undefined)

export default function BackgroundsProvider(props: {
  children: React.ReactElement
}) {
  const {event} = useEvent()
  const dispatch = useDispatch()
  const {zoomBackgrounds: backgroundsTemplateDataDefaults} = createSimpleBlog()

  const [
    backgroundsTemplateData,
    setBackgroundsTemplateData,
  ] = useState<BackgroundsTemplateData>(backgroundsTemplateDataDefaults)
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [isRemoving, setIsRemoving] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [requestError, setRequestError] = useState<string>('')
  const updateEvent = useUpdate()
  const template = useTemplate()

  useEffect(() => {
    if (!event.template || !event.backgrounds) {
      return
    }

    // If there aren't any zoomBackgrounds settings in the template currently,
    // apply the defaults from the BackgroundsProvider. This prevents issues when
    // an event is self-migrating from no backgrounds, to having backgrounds (any
    // event that was created before "Zoom Backgrounds" were a thing).
    if (typeof event.template.zoomBackgrounds !== 'undefined') {
      setBackgroundsTemplateData(event.template.zoomBackgrounds)
    }

    setBackgrounds(event.backgrounds)
    setLoading(false)
  }, [backgroundsTemplateData, backgroundsTemplateDataDefaults, event])

  const clearError = () => setError('')
  const clearRequestError = () => setRequestError('')

  const uploadBackground = (data: {} | FormData): Promise<any> => {
    if (isUploading) {
      return new Promise((resolve, reject) => reject(false))
    }

    clearError()
    clearRequestError()
    setIsUploading(true)

    const url = api(`/events/${event.slug}/backgrounds`)
    return client
      .post<ObvioEvent>(url, data)
      .then((event) => {
        // Currently, the response to the "upload zoom background image" request
        // returns a full Event payload. This lets us update the event/backgrounds
        // without having to do another fetch of the background assets. Although,
        // this is breaking the RESTful principals, of not returning the payload
        // according to the request. We're uploading a background image, we SHOULD
        // get a response of just the image upload request.
        //
        // This of course can be refactored if we decide to make a fetch AFTER
        // getting the response to the upload.
        dispatch(setEvent(event))
        setBackgrounds(event.backgrounds)
      })
      .catch((e) => {
        setRequestError(e.message)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  /**
   * Removes a background image from the event.
   *
   * @param id number
   * @returns Promise
   */
  const removeBackground = (id: number) => {
    if (isRemoving) {
      return
    }

    clearRequestError()
    setIsRemoving(true)

    client
      .delete<ObvioEvent>(api(`/events/${event.slug}/backgrounds/${id}`))
      .then((event) => {
        dispatch(setEvent(event))
        setBackgrounds(event.backgrounds)
      })
      .catch((e) => {
        setRequestError(e.message)
      })
      .finally(() => {
        setIsRemoving(false)
      })
  }

  /**
   * Method to send the Zoom Backgrounds page title/description and template
   * configuration to storage in the backend.
   *
   * @param data BackgroundsData
   * @param dataTemplate BackgroundsTemplateData
   * @returns Promise
   */
  const setBackgroundData = (
    data: BackgroundsData,
    dataTemplate: BackgroundsTemplateData,
  ): Promise<any> => {
    if (isSubmitting === true) {
      return new Promise((resolve, reject) => reject(false))
    }

    clearRequestError()
    setIsSubmitting(true)

    const withTemplate = {
      ...data,
      template: {
        ...template,
        zoomBackgrounds: dataTemplate,
      },
    }

    return updateEvent(withTemplate)
      .catch((e) => {
        setRequestError(e.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <BackgroundsContext.Provider
      value={{
        backgrounds,
        isRemoving,
        isSubmitting,
        isUploading,
        loading,
        error,
        requestError,
        backgroundsTemplateData,
        setError,
        clearError,
        clearRequestError,
        uploadBackground,
        removeBackground,
        setBackgroundData,
      }}
    >
      {props.children}
    </BackgroundsContext.Provider>
  )
}

export function useBackgrounds() {
  const context = React.useContext(BackgroundsContext)

  if (context === undefined) {
    throw new Error('useBackgrounds must be used within a BackgroundsProvider')
  }

  return context
}

/**
 * Normalized preview container of the Zoom Background, with the template settings
 * applied. Used on the Config page as well as the Attendee page.
 */
export const ImagePreviewContainer = styled.img<{
  borderRadius: number
  borderThickness: number
  borderColor: string
  clickable: boolean | undefined
}>`
  border-radius: ${(props) => props.borderRadius}px;
  border-width: ${(props) => props.borderThickness}px;
  border-color: ${(props) => props.borderColor};
  border-style: solid;
  cursor: ${(props) => (props.clickable === true ? 'pointer' : 'default')};
`
