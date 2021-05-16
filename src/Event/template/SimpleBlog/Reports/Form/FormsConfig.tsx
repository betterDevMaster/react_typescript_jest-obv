import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Grid, withStyles} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import {
  DragDropContext,
  Droppable,
  DroppableProvidedProps,
  DropResult,
} from 'react-beautiful-dnd'
import {spacing} from 'lib/ui/theme'
import FormItem from 'Event/template/SimpleBlog/Reports/Form/FormItem'
import EditFormDialog from 'Event/template/SimpleBlog/Reports/Form/EditFormDialog'
import {Form} from 'organization/Event/FormsProvider'
import {useReportsConfig} from 'organization/Event/ReportsConfig'
import AddNewFormDialog from 'Event/template/SimpleBlog/Reports/Form/AddFormDialog'

export default function FormsConfig(props: {isPreview: boolean}) {
  const [editing, setEditing] = useState<null | Form>(null)
  const [addNewDialogVisible, setAddNewDialogVisible] = useState(false)
  const {report, update, processing} = useReportsConfig()
  const [forms, setForms] = useState<Form[]>(report.forms)
  const handleDrag = useHandleDrag(forms, setForms)

  const toggleAddNewDialog = () => setAddNewDialogVisible(!addNewDialogVisible)

  /**
   * Auto-save forms on update
   */
  useEffect(() => {
    const ids = forms.map((f) => f.id)

    const updatedCount = ids.length !== report.forms.length
    const updatedItems = ids.filter((id, index) => {
      const form = report.forms[index]
      const current = form ? form.id : null
      return current !== id
    })

    const hasUpdatedItem = updatedItems.length > 0
    const hasUpdates = updatedCount || hasUpdatedItem

    if (processing || !hasUpdates) {
      return
    }

    update({forms: ids})
  }, [forms, update, processing, report])

  const add = (form: Form) => {
    const existing = Boolean(forms.find((f) => f.id === form.id))
    if (existing) {
      toggleAddNewDialog()
      return
    }

    const added = [...forms, form]
    setForms(added)
    toggleAddNewDialog()
  }

  const edit = (form: Form | null) => {
    setEditing(form)
  }

  const remove = (form: Form) => {
    const removed = forms.filter((f) => f.id !== form.id)
    setForms(removed)
  }

  if (props.isPreview) {
    return null
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="report_form_ids">
          {(provided) => (
            <Container ref={provided.innerRef} {...provided.droppableProps}>
              <>
                {forms.map((form, index) => (
                  <FormItem
                    edit={() => edit(form)}
                    form={form}
                    index={index}
                    key={form.id}
                  />
                ))}
                {provided.placeholder}
                <StyledAddButton
                  onClick={toggleAddNewDialog}
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="primary"
                  aria-label="add form"
                >
                  Add Form
                </StyledAddButton>
              </>
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <EditFormDialog
        form={editing}
        onRemove={remove}
        onClose={() => setEditing(null)}
      />
      <AddNewFormDialog
        visible={addNewDialogVisible}
        onClose={toggleAddNewDialog}
        onAdd={add}
      />
    </>
  )
}

const StyledAddButton = withStyles({
  root: {
    marginTop: spacing[6],
  },
})(Button)

const Container = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    children: React.ReactElement | React.ReactElement[]
  } & Partial<DroppableProvidedProps>
>((props, ref) => (
  <Box className={props.className} ref={ref} {...props}>
    <Grid container justify="center" spacing={2}>
      {props.children}
    </Grid>
  </Box>
))

const Box = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};
  margin-top: ${(props) => props.theme.spacing[7]};
  width: 100%;
`

function useHandleDrag(forms: Form[], setForms: (forms: Form[]) => void) {
  return (result: DropResult) => {
    const {destination, source} = result

    if (!destination) {
      return
    }

    const moved = Array.from(forms)
    const [removed] = moved.splice(source.index, 1)
    moved.splice(destination.index, 0, removed)

    setForms(moved)
  }
}
