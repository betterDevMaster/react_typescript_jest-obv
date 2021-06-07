import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import Box from '@material-ui/core/Box'
import {TicketRibbonConfigProps} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbonConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {CustomTicketRibbon} from 'Event/template/SimpleBlog/Dashboard/TicketRibbonList/TicketRibbon'

export default function CustomRibbonImage(props: TicketRibbonConfigProps) {
  const {ticketRibbon, processing, setProcessing, update} = props
  const deleteRibbon = useDeleteCustomRibbon()

  const remove = () => {
    if (processing || !ticketRibbon.customRibbon) {
      return
    }

    setProcessing(true)

    deleteRibbon(ticketRibbon.customRibbon)
      .then(() => {
        update('customRibbon')(null)
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  if (!ticketRibbon.customRibbon) {
    return null
  }

  return (
    <Box mb={2}>
      <ImageBox>
        <img
          src={ticketRibbon.customRibbon.image.url}
          alt={ticketRibbon.name}
        />
      </ImageBox>
      <Box display="flex" justifyContent="flex-end">
        <DangerButton
          onClick={remove}
          variant="outlined"
          aria-label="delete custom ribbon"
        >
          Delete
        </DangerButton>
      </Box>
    </Box>
  )
}

export function useDeleteCustomRibbon() {
  const {client} = useOrganization()

  return (customRibbon: CustomTicketRibbon) => {
    const url = api(`/ticket_ribbons/${customRibbon.id}`)
    return client.delete(url)
  }
}

const ImageBox = styled.div`
  margin-top: ${(props) => props.theme.spacing[4]}!important;
  margin-bottom: ${(props) => props.theme.spacing[2]}!important;

  img {
    width: 100%;
  }
`
