import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Parser} from 'htmlparser2'
import {
  useEditComponent,
  useEditMode,
} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {withStyles} from '@material-ui/core'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import {useTemplate} from 'Event/TemplateProvider'
import {useWithAttendeeData} from 'Event/auth/data'

export const BODY_HTML_EMBED = 'Embed HTML'

export default function BodyHTMLEmbed() {
  const anchor = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scriptElements, setScriptElements] = useState<HTMLElement[]>([])
  const {bodyHTMLEmbed: bodyEmbed} = useTemplate()
  const isEditMode = useEditMode()
  const withAttendeeData = useWithAttendeeData()

  const html = bodyEmbed ? withAttendeeData(bodyEmbed) : ''

  const el = useRef<HTMLElement | null>(null)

  /**
   * Parse script elements
   */

  const parser = useMemo(
    () =>
      new Parser({
        onopentag(name, attributes) {
          if (name !== 'script') {
            return
          }

          el.current = document.createElement(name)

          for (const [key, value] of Object.entries(attributes)) {
            el.current.setAttribute(key, value)
          }
        },
        ontext(text) {
          if (el.current) {
            el.current.innerHTML = el.current.innerHTML + text
          }
        },
        onclosetag() {
          const built = el.current
          if (!anchor.current || !built || !isScript(built)) {
            return
          }

          setScriptElements((current) => [...current, built])
          el.current = null
        },
      }),
    [],
  )

  useEffect(() => {
    parser.write(html)
    parser.end()
  }, [parser, html])

  /**
   * Dynamically load, and execute script elements
   */

  useEffect(() => {
    const hasEl = scriptElements.length > 0
    if (!anchor.current || isLoading || !hasEl || isEditMode) {
      return
    }

    const nextEl = scriptElements[0]

    const isExternalScript = isScript(nextEl) && nextEl.src
    if (isExternalScript) {
      setIsLoading(true)
      nextEl.onload = function () {
        setIsLoading(false)
      }
    }

    const removed = scriptElements.filter((_, index) => index !== 0)
    anchor.current.insertBefore(nextEl, null)
    setScriptElements(removed)
  }, [isLoading, scriptElements, isEditMode])

  const contentElements = isEditMode ? '' : withoutScriptTags(html)

  return (
    <>
      <EditButton />
      <div
        ref={anchor}
        dangerouslySetInnerHTML={{__html: contentElements}}
      ></div>
    </>
  )
}

/**
 * Removes all <script> tags from given html string.
 *
 * @param html
 * @returns
 */
function withoutScriptTags(html: string) {
  const cleaned = html
    .replace(/<script(.)*(\/>|<\/script>)/, '') // Single line scripts <script/>
    .replace(/<script(.|\s)*(<\/script>)/, '') // Multi-line

  return cleaned
}

function isScript(element: HTMLElement): element is HTMLScriptElement {
  return element.tagName === 'SCRIPT'
}

function EditButton() {
  const edit = useEditComponent({type: BODY_HTML_EMBED})

  return (
    <EditModeOnly>
      <StyledEditButton
        onClick={edit}
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="edit body html embed"
      >
        Embed HTML
      </StyledEditButton>
    </EditModeOnly>
  )
}

const StyledEditButton = withStyles({
  root: {
    marginTop: spacing[10],
    marginBottom: spacing[4],
  },
})(Button)
