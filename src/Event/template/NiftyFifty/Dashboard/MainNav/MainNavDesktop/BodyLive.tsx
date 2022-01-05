import React from 'react'

import {useNiftyFiftyTemplate} from 'Event/template/NiftyFifty'
import MainNavButton from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavButton'
import {Container} from 'Event/template/NiftyFifty/Dashboard/MainNav/MainNavDesktop'

import {orderedIdsByPosition} from 'lib/list'

export default function BodyLive(props: {className?: string}) {
  /**
   * Cursor is the index of the first item on the page. If we're on the
   * first page this would be 0.
   */
  const template = useNiftyFiftyTemplate()
  const {nav} = template

  const ids = orderedIdsByPosition(nav)

  /**
   * Whenever num items on a page changes we always go back to first
   * page to prevent the cursor from being stuck at old counts
   * ie. on cursor 3 when only single page.
   */

  return (
    <Container className={props.className}>
      <>
        {ids.map((id, index) => (
          <MainNavButton id={id} index={index} key={id} button={nav[id]} />
        ))}
      </>
    </Container>
  )
}
