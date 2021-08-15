import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import Box from '@material-ui/core/Box'
import {
  CustomTicketRibbon,
  TicketRibbonUploadProps,
} from 'organization/Event/DashboardConfig/TicketRibbonUpload'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'

export default function UploadedTicketRibbon(props: TicketRibbonUploadProps) {
  const {processing, setProcessing, setCustomRibbon, customRibbon} = props
  const deleteRibbon = useDeleteCustomRibbon()

  const remove = () => {
    if (processing || !customRibbon) {
      return
    }

    setProcessing(true)

    deleteRibbon(customRibbon).finally(() => {
      /**
       * Always unset image, even on fail. This way
       * the user can try again.
       */
      setCustomRibbon(null)
      setProcessing(false)
    })
  }

  if (!customRibbon) {
    return null
  }

  return (
    <Box mb={2}>
      <ImageBox>
        <img src={customRibbon.image.url} alt="Ticket ribbon" />
      </ImageBox>
      <DangerButton
        onClick={remove}
        disabled={processing}
        variant="outlined"
        aria-label="delete custom ribbon"
      >
        Delete
      </DangerButton>
    </Box>
  )
}

const ImageBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;

  img {
    max-width: 100%;
  }
`

export function useDeleteCustomRibbon() {
  const {client} = useOrganization()

  return (customRibbon: CustomTicketRibbon) => {
    const url = api(`/ticket_ribbons/${customRibbon.id}`)
    return client.delete(url)
  }
}
