import React, {useState, useCallback, useEffect} from 'react'
import {usePanels} from 'Event/template/Panels'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import Sizer from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop/Sizer'
import PageArrows from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop/PageArrows'
import CountDownTimers from 'Event/template/Panels/Dashboard/CountDownTimers'
import {Container} from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop'

export default function BodyLive(props: {className?: string}) {
  /**
   * Cursor is the index of the first item on the page. If we're on the
   * first page this would be 0.
   */
  const [cursor, setCursor] = useState(0)
  const [perPage, setPerPage] = useState(0)
  const {template} = usePanels()
  const {
    nav: {ids, entities},
  } = template

  const numItems = ids.length

  const resetCursor = useCallback(() => {
    setCursor(0)
  }, [setCursor])

  /**
   * Whenever num items on a page changes we always go back to first
   * page to prevent the cursor from being stuck at old counts
   * ie. on cursor 3 when only single page.
   */
  useEffect(resetCursor, [perPage])

  const lastPage = perPage ? cursor + perPage : ids.length

  const visibleIds = ids.filter((_, index) => {
    return cursor <= index && index < lastPage
  })

  const hasNextPage = () => {
    if (!perPage) {
      return false
    }

    const lastIndex = cursor + perPage
    return lastIndex < numItems
  }
  const hasPrevPage = cursor > 0

  const goNextPage = () => {
    setCursor(cursor + perPage)
  }

  const goPrevPage = () => {
    setCursor(cursor - perPage)
  }

  return (
    <Container className={props.className}>
      <>
        <CountDownTimers />
        {ids.map((id, index) => (
          <MainNavButton
            id={id}
            index={index}
            key={id}
            button={entities[id]}
            isHidden={!visibleIds.includes(id)}
          />
        ))}
        <Sizer
          className={props.className}
          start={cursor}
          perPage={perPage}
          onChange={setPerPage}
        />
        <PageArrows
          hasNext={hasNextPage()}
          onNext={goNextPage}
          hasPrev={hasPrevPage}
          onPrev={goPrevPage}
        />
      </>
    </Container>
  )
}
