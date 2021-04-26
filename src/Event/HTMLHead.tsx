import React from 'react'
import {useEvent} from 'Event/EventProvider'
import {Helmet} from 'react-helmet'
import defaultFavicon from 'assets/images/favicon.png'

export default function HTMLHead(props: {children: React.ReactElement}) {
  const {event} = useEvent()
  const favicon = useFavicon()

  return (
    <>
      <Helmet>
        <link rel="icon" href={favicon} />
        <title>{event.name}</title>
      </Helmet>
      {props.children}
    </>
  )
}

function useFavicon() {
  const {event} = useEvent()

  if (!event.favicon) {
    return defaultFavicon
  }

  return event.favicon.url
}
