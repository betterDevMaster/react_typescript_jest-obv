import React from 'react'
import styled from 'styled-components'
import StarIcon from '@material-ui/icons/Stars'
import {useOwner} from 'organization/OwnerProvider'

export default function OrganizationCreditBalance(props: {className?: string}) {
  const {owner} = useOwner()

  if (!owner) {
    return null
  }

  return (
    <div className={props.className}>
      <Top>
        <StyledStarIcon />
        Organization's Available Credits
      </Top>
      <NumCredits aria-label="organization credit balance">
        {owner.credits}
      </NumCredits>
    </div>
  )
}

const Top = styled.div`
  display: flex;
  align-items: center;
`

const StyledStarIcon = styled(StarIcon)`
  font-size: 24px;
  margin-right: ${(props) => props.theme.spacing[1]};
`

const NumCredits = styled.span`
  color: ${(props) => props.theme.colors.accent};
  font-weight: bold;
  font-size: 20px;
  margin-left: ${(props) => props.theme.spacing[7]};
`
