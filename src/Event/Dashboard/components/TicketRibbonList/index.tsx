import AddTicketRibbonButton from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig/AddTicketRibbonButton'
import {useTemplate} from 'Event/TemplateProvider'
import TicketRibbonItem, {
  TicketRibbon,
} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import EditModeOnly from 'Event/Dashboard/editor/views/EditModeOnly'
import React from 'react'
import styled from 'styled-components'
import HiddenOnMatch from 'Event/visibility-rules/HiddenOnMatch'

export default () => {
  const {ticketRibbons} = useTemplate()

  return (
    <>
      <EditModeOnly>
        <StyledSetTicketRibbonButton />
      </EditModeOnly>
      <RibbonsContainer>
        {ticketRibbons &&
          ticketRibbons.map((ticketRibbon: TicketRibbon, index: number) => {
            return (
              <HiddenOnMatch rules={ticketRibbon.rules} key={index}>
                <TicketRibbonItem ticketRibbon={ticketRibbon} index={index} />
              </HiddenOnMatch>
            )
          })}
      </RibbonsContainer>
    </>
  )
}

const RibbonsContainer = styled.div``

const StyledSetTicketRibbonButton = styled(AddTicketRibbonButton)`
  margin-bottom: ${(props) => props.theme.spacing[6]}!important;
`
