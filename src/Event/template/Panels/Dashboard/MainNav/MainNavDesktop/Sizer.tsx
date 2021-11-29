import React, {useEffect, useState, useCallback} from 'react'
import styled from 'styled-components'
import {usePanelsTemplate} from 'Event/template/Panels'
import MainNavButton from 'Event/template/Panels/Dashboard/MainNav/MainNavButton'
import $ from 'jquery'
import useDebounce from 'lib/debounce'
import {useOnResize} from 'lib/resize'
import PageArrows from 'Event/template/Panels/Dashboard/MainNav/MainNavDesktop/PageArrows'
import CountDownTimers from 'Event/template/Panels/Dashboard/CountDownTimers'
import {orderedIdsByPosition} from 'lib/list'

/**
 * Amount of time to wait until resizing is done before calculating
 * the ideal per page count. Too low and we run into performance
 * issues, too high and the user will perceive layout breakage.
 */
const RESIZE_DELAY_MS = 300

/**
 * Invisible sizer to help determine the number of buttons per page. The
 * strategy here is to start at 1 item per page and increase until the
 * tallest page is bigger than the container, then shrink to fit.
 *
 * @param props
 * @returns
 */
export default function Sizer(props: {
  className?: string
  start: number
  perPage: number | null
  onChange: (perPage: number) => void
}) {
  const template = usePanelsTemplate()
  const ids = orderedIdsByPosition(template.nav)

  const {onChange} = props
  const [perPage, setPerPage] = useState(1)
  const [isGrowing, setIsGrowing] = useState(true)
  const debouncedPerPage = useDebounce(perPage, RESIZE_DELAY_MS)
  const [parentHeight, setParentHeight] = useState(0)

  const numItems = ids.length

  const numPages = Math.ceil(numItems / perPage) // ie. 2.5 becomes 3 pages

  const grow = useCallback(() => {
    setIsGrowing(true)
    setPerPage((current) => current + 1)
  }, [setIsGrowing, setPerPage])

  const shrink = () => {
    setIsGrowing(false)
    setPerPage((current) => (current > 1 ? current - 1 : 1))
  }

  /**
   * Setup watcher to set parent height. We'll set up an observer in case
   * components come/go which would affect the space we have to
   * work with.
   */
  useEffect(() => {
    const parent = $('#main-nav')

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height
      setParentHeight(height)
    })

    observer.observe(parent[0])
  }, [])

  /**
   * Kick-off sizing...
   */
  const calculate = useCallback(() => {
    setPerPage(1)
    grow()
  }, [setPerPage, grow])

  /**
   * Initial render
   */
  useEffect(calculate, [calculate])

  useOnResize(calculate) // Handle updating browser height

  useEffect(() => {
    if (!parentHeight) {
      return
    }

    const pageEls = $('.main-nav-shadow-page').toArray()

    const heights = pageEls.map((el) => $(el).height())

    const maxHeight = heights.reduce(
      (acc: number, i) => Math.max(acc, i || 0),
      0,
    )

    const hasSpace = maxHeight < parentHeight // Whether content exceeds container space
    const hasMoreItems = perPage <= numItems // ie. won't fit on 1 page
    const canGrow = hasSpace && hasMoreItems && isGrowing

    if (canGrow) {
      grow()
    }

    const canShrink = !hasSpace && perPage > 1
    if (canShrink) {
      shrink()
    }
  }, [perPage, numItems, isGrowing, grow, parentHeight])

  /**
   * Notify parent of result
   */
  useEffect(() => {
    onChange(debouncedPerPage)
  }, [debouncedPerPage, onChange])

  return (
    <Box className={props.className}>
      {Array.from({length: numPages}, (_, index) => {
        const number = index + 1
        const isFirst = index === 0
        const isLast = number === numPages
        return (
          <Page
            number={number}
            numItems={perPage}
            key={index}
            isLast={isLast}
            isFirst={isFirst}
            calculate={calculate}
          />
        )
      })}
    </Box>
  )
}

function Page(props: {
  number: number
  numItems: number
  isFirst: boolean
  isLast: boolean
  calculate: () => void
}) {
  const {number, numItems, isLast, isFirst} = props

  const template = usePanelsTemplate()

  /**
   * Only render the visible buttons for a given page.
   */
  const start = number * numItems - numItems
  const end = start + numItems
  const ids = orderedIdsByPosition(template.nav)
  const visibleIds = ids.filter((_, index) => start <= index && index < end)

  return (
    <div className="main-nav-shadow-page">
      <CountDownTimers onRender={props.calculate} />
      {visibleIds.map((id, index) => (
        <MainNavButton
          id={id}
          index={index}
          key={id}
          button={template.nav[id]}
          disableEdit
        />
      ))}
      <PageArrows
        hasNext={!isLast}
        hasPrev={!isFirst}
        onNext={() => {}}
        onPrev={() => {}}
        disableLabel
      />
    </div>
  )
}

const Box = styled.div`
  width: 100%;
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
  z-index: -1;

  display: flex;
  flex-direction: column;
  justify-content: center;
`
