import React, {useState} from 'react'
import styled from 'styled-components'
import {Editable} from 'Event/Dashboard/editor/views/EditComponent'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import {useDispatchUpdate} from 'Event/TemplateProvider'
import Grid from '@material-ui/core/Grid'
import {useAttendeeVariables} from 'Event'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {usePanels} from 'Event/template/Panels'
import {Publishable} from 'Event/Dashboard/editor/views/Published'
import {HasRules} from 'Event/attendee-rules'
import ResourceItem from 'Event/template/Panels/Dashboard/Resources/ResourceList/ResourceItem'
import ResourceListConfig from 'Event/template/Panels/Dashboard/Resources/ResourceList/ResourceListConfig'
import AddResourceButton from 'Event/template/Panels/Dashboard/Resources/ResourceList/AddResourceButton'
import {PageTitle} from 'Event/template/Panels/Page'

export interface ResourceList {
  title: string
  resources: Resource[]
  cardBackgroundColor?: string
  cardBackgroundOpacity?: number
  color?: string
  linkColor?: string
  menuTitle?: string
  isVisible?: boolean
}

export type Resource = Publishable &
  HasRules & {
    name: string
    filePath: string
    description: string | null
    isUrl?: boolean
    url?: string
    linkText?: string
  }

export default function ResourceList() {
  const isEdit = useEditMode()
  const {template} = usePanels()
  const [configVisible, setConfigVisible] = useState(false)
  const toggleListConfig = () => setConfigVisible(!configVisible)

  const {resourceList: list} = template
  const v = useAttendeeVariables()

  const hasResources = list.resources.length > 0
  if (!hasResources && !isEdit) {
    return null
  }

  return (
    <div>
      <ResourceListConfig
        isVisible={configVisible}
        onClose={toggleListConfig}
      />
      <Editable onEdit={toggleListConfig}>
        <PageTitle aria-label="resources">{v(list.title)}</PageTitle>
      </Editable>
      <DroppableList />
      <EditModeOnly>
        <StyledAddResourceButton />
      </EditModeOnly>
    </div>
  )
}

function DroppableList() {
  const handleDrag = useHandleDrag()
  const isEdit = useEditMode()

  if (!isEdit)
    return (
      <Container>
        <ResourceItemList />
      </Container>
    )

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="drag-and-drop-resources">
        {(provided) => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            <>
              <ResourceItemList />
              {provided.placeholder}
            </>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function ResourceItemList() {
  const {template} = usePanels()
  const {resourceList: list} = template

  return (
    <>
      {list.resources.map((resource: Resource, index: number) => (
        <ResourceItem
          key={index}
          id={`resource-item-${index}`}
          resource={resource}
          index={index}
        />
      ))}
    </>
  )
}

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: React.ReactElement | React.ReactElement[]
  } & Partial<DroppableProvidedProps>
>((props, ref) => (
  <Box className={props.className} ref={ref} {...props}>
    <Grid container>{props.children}</Grid>
  </Box>
))

function useHandleDrag() {
  const updateTemplate = useDispatchUpdate()
  const {template} = usePanels()

  const {resourceList: list} = template

  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(list.resources)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    updateTemplate({
      resourceList: {
        ...list,
        resources: moved,
      },
    })
  }
}

const Box = styled.div`
  margin-bottom: 30px;
  width: 100%;
`

const StyledAddResourceButton = styled(AddResourceButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
  margin-top: ${(props) => props.theme.spacing[5]}!important;
`
