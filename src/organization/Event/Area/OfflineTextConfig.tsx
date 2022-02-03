import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import {useArea} from 'organization/Event/Area/AreaProvider'
import Dialog from 'lib/ui/Dialog'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import {Area} from 'organization/Event/AreasProvider'

interface ConfigProps {
  isVisible: boolean
  onClose: () => void
}

export default function OfflineTextConfig(props: ConfigProps) {
  const {isVisible, onClose} = props
  const {area, update, processing} = useArea()
  const {handleSubmit, register} = useForm()

  const save = (data: Pick<Area, 'offline_title' | 'offline_description'>) => {
    update(data)
    onClose()
  }

  return (
    <Dialog open={isVisible} onClose={onClose} maxWidth={'xl'}>
      <FormContainer>
        <form onSubmit={handleSubmit(save)}>
          <TextField
            defaultValue={area.offline_title}
            name="offline_title"
            fullWidth
            variant="outlined"
            label="Offline Title"
            disabled={processing}
            inputProps={{
              ref: register,
              'aria-label': 'offline title',
            }}
          />
          <TextField
            defaultValue={area.offline_description}
            name="offline_description"
            fullWidth
            variant="outlined"
            label="Offline Description"
            disabled={processing}
            multiline
            rows="4"
            inputProps={{
              ref: register,
              'aria-label': 'offline description',
            }}
          />

          <StyledSaveButton
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            aria-label="save offline text"
          >
            Save
          </StyledSaveButton>
        </form>
      </FormContainer>
    </Dialog>
  )
}

const FormContainer = styled.div`
  padding: 50px;
  padding-bottom: 40px;
`

const StyledSaveButton = styled(Button)`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;
`
