import React from 'react'
import {Draggable} from 'react-beautiful-dnd'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import {DragHandle, DraggableOverlay} from 'lib/ui/drag-and-drop'
import {
  Container,
  ResourceItemLink,
  ResourceItemProps,
} from 'Event/template/SimpleBlog/Dashboard/ResourceList/ResourceItem'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useToggle} from 'lib/toggle'
import {ResourceGroupItemConfig} from 'Event/template/SimpleBlog/Dashboard/ResourceGroupList/ResourceGroupItemConfig'

type ResourceGroupItemProps = ResourceItemProps & {
  groupId: number
}

export default React.memo((props: ResourceGroupItemProps) => {
  const {resource, index} = props
  const isEdit = useEditMode()
  const {flag: configVisible, toggle: toggleConfig} = useToggle()

  if (!isEdit)
    return (
      <Container resource={resource}>
        <ResourceItemLink resource={resource} iconColor={props.iconColor} />
      </Container>
    )

  return (
    <>
      <ResourceGroupItemConfig
        isVisible={configVisible}
        onClose={toggleConfig}
        resource={resource}
        id={index}
        groupIndex={props.groupId}
      />
      <Draggable draggableId={props.id} index={index}>
        {(provided) => (
          <Container
            resource={resource}
            ref={provided.innerRef}
            draggableProps={provided.draggableProps}
          >
            <DraggableOverlay>
              <Editable onEdit={toggleConfig}>
                <>
                  <DragHandle handleProps={provided.dragHandleProps} />
                  <ResourceItemLink
                    resource={resource}
                    iconColor={props.iconColor}
                  />
                </>
              </Editable>
            </DraggableOverlay>
          </Container>
        )}
      </Draggable>
    </>
  )
})
