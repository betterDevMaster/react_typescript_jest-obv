import styled from 'styled-components'
import React from 'react'
import DangerButton from 'lib/ui/Button/DangerButton'
import Box from '@material-ui/core/Box'
import {TicketRibbonConfigProps} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbonConfig'
import {useOrganization} from 'organization/OrganizationProvider'
import {api} from 'lib/url'
import {CustomTicketRibbon} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarItem/TicketRibbonList/TicketRibbon'

export default function CustomRibbonImage(props: TicketRibbonConfigProps) {
  const {processing, setProcessing, setCustomRibbon, customRibbon} = props
  const deleteRibbon = useDeleteCustomRibbon()

  const remove = () => {
    if (processing || !customRibbon) {
      return
    }

    setProcessing(true)

    deleteRibbon(customRibbon)
      .then(() => {
        setCustomRibbon(null)
      })
      .finally(() => {
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
