import Grid from '@material-ui/core/Grid'
import NavButton, {NavButtonWithSize} from 'Dashboard/components/NavButton'
import EditComponent from 'Dashboard/edit/views/EditComponent'
import {SimpleBlog} from 'Dashboard/Template/SimpleBlog'
import React from 'react'
import {useSelector} from 'react-redux'
import {RootState} from 'store'

export const MAIN_NAV_BUTTON = 'MAIN_NAV_BUTTON'
interface MainNavButtonProps {
  buttons: SimpleBlog['mainNavButtons']
  id: string
  isEditMode?: boolean
}

export default function MainNavButton(props: MainNavButtonProps) {
  const button = useCurrentButton(!!props.isEditMode, props.id, props.buttons)
  return <MemoizedButton {...props} button={button} />
}

function useCurrentButton(
  isEditMode: boolean,
  id: string,
  saved: SimpleBlog['mainNavButtons'],
) {
  const current = useSelector(
    (state: RootState) => state.dashboardEditor.mainNavButtons,
  )

  if (!isEditMode || !current) {
    return saved.entities[id]
  }

  return current.entities[id]
}

const MemoizedButton = React.memo(
  (
    props: MainNavButtonProps & {
      button: NavButtonWithSize
    },
  ) => {
    if (props.isEditMode) {
      return (
        <Grid item xs={12} md={props.button.size}>
          <EditComponent type={MAIN_NAV_BUTTON} id={props.id}>
            <NavButton
              {...props.button}
              id={props.id}
              ariaLabel="main nav button"
              isEditMode={false}
            />
          </EditComponent>
        </Grid>
      )
    }

    return (
      <Grid item xs={12} md={props.button.size}>
        <NavButton
          {...props.button}
          id={props.id}
          ariaLabel="main nav button"
          isEditMode={false}
        />
      </Grid>
    )
  },
)
