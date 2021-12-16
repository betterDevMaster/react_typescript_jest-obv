import React, {useState} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'

import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {SizedLogoConfig} from 'Event/template/FiftyBlog/Dashboard/SizedLogo/SizedLogoConfig'
import {useFiftyBlogTemplate} from 'Event/template/FiftyBlog'
import {useEvent} from 'Event/EventProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import defaultLogo from 'assets/images/logo.png'

export default function EmojiList() {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const edit = () => setIsEditing(true)
  const stopEditing = () => setIsEditing(false)
  const template = useFiftyBlogTemplate()
  const {sizedLogo} = template
  const {event} = useEvent()
  const logo = event.sized_logo ? event.sized_logo.url : defaultLogo
  const isEditMode = useEditMode()

  return (
    <div className="mt-8">
      <EditModeOnly>
        <SizedLogoConfig isVisible={isEditing} onClose={stopEditing} />
      </EditModeOnly>
      <Editable onEdit={edit} className="w-full">
        <Box aria-label="sizedlogo">
          {sizedLogo.hidden ? (
            isEditMode && (
              <StyledButton
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                aria-label="edit sizedlogo"
              >
                Edit Logo
              </StyledButton>
            )
          ) : (
            <LogoImage
              aria-label="event sizedlogo"
              src={logo}
              isLogoHidden={sizedLogo.hidden}
              size={sizedLogo.size}
            />
          )}
        </Box>
      </Editable>
    </div>
  )
}

const Box = styled.div`
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  display: flex;
  justify-content: center;
`

/**
 * Adjust the container according to the following requirements:
 *
 * - If no size is set, the emoji should expand until all available width, shared evenly.
 * - If a size is set, show set size if possible.
 * - If showing set size will stretch container, then render in available width.
 */
export const StyledButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[2]}!important;
`

export const LogoImage = styled.img<{
  isLogoHidden?: boolean
  size: number
}>`
  display: ${(props) => (props.isLogoHidden ? 'none' : 'block')};
  max-width: 100%;
  width: ${(props) => props.size}%;
  cursor: pointer;
  margin: 0 auto;
`
