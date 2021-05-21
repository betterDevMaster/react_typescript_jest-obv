import React, {useState} from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import {spacing} from 'lib/ui/theme'
import Button from '@material-ui/core/Button'
import EditBodyDialog from 'Event/template/SimpleBlog/Reports/Body/EditBodyDialog'

export default function Body(props: {isPreview: boolean}) {
  const [editing, setEditing] = useState(false)
  const toggleEditing = () => setEditing(!editing)

  if (props.isPreview) {
    return null
  }

  return (
    <>
      <StyledEditButton
        onClick={toggleEditing}
        fullWidth
        size="large"
        variant="outlined"
        color="primary"
        aria-label="edit body"
      >
        Edit Body
      </StyledEditButton>
      <EditBodyDialog visible={editing} onClose={toggleEditing} />
    </>
  )
}

const StyledEditButton = withStyles({
  root: {
    marginTop: spacing[6],
  },
})(Button)
