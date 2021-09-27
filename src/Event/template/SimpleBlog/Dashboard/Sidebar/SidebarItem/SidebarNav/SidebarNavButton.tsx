import React from 'react'
import styled from 'styled-components'
import NavButton from 'Event/Dashboard/components/NavButton'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import Published from 'Event/Dashboard/editor/views/Published'
import {Draggable} from 'react-beautiful-dnd'
import {DraggableOverlay, DragHandle} from 'lib/ui/drag-and-drop'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {useToggle} from 'lib/toggle'
import {SidebarNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav/SidebarNavButtonConfig'
import {SidebarNavProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/SidebarNav'

export default React.memo(
  (props: NavButton & {id: string; index: number; nav: SidebarNavProps}) => {
    const isEditMode = useEditMode()

    const {flag: configVisible, toggle: toggleConfig} = useToggle()
    const {flag: showingCopyConfig, toggle: toggleCopyConfig} = useToggle()

    const edit = () => {
      toggleConfig()
    }

    const button = (
      <Published component={props}>
        <StyledNavButtonComponent
          aria-label="sidebar nav button"
          textColor="#FFFFFF"
          borderWidth={1}
          borderColor="#FFFFFF"
          {...props}
        />
      </Published>
    )

    if (!isEditMode) {
      return button
    }

    return (
      <>
        <SidebarNavButtonConfig
          nav={props.nav}
          button={props}
          id={props.id}
          isVisible={configVisible}
          onClose={toggleConfig}
        />
        <SidebarNavButtonConfig
          nav={props.nav}
          button={props}
          isVisible={showingCopyConfig}
          onClose={toggleCopyConfig}
        />
        <Draggable draggableId={props.id} index={props.index}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              <DraggableOverlay>
                <Editable onEdit={edit} onCopy={toggleCopyConfig}>
                  <>
                    <DragHandle handleProps={provided.dragHandleProps} />
                    {button}
                  </>
                </Editable>
              </DraggableOverlay>
            </div>
          )}
        </Draggable>
      </>
    )
  },
)

const StyledNavButtonComponent = styled(NavButton)`
  font-size: 14px;
  padding: ${(props) => `${props.theme.spacing[3]} ${props.theme.spacing[4]}`};
  margin: ${(props) => props.theme.spacing[3]} 0;
`
