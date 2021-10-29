import React from 'react'
import styled from 'styled-components'
import StarIcon from '@material-ui/icons/Stars'
import {useObvioUser} from 'obvio/auth'

export default function CreditBalance(props: {className?: string}) {
  const user = useObvioUser()

  return (
    <div className={props.className}>
      <Top>
        <StyledStarIcon />
        Available Credits
      </Top>
      <NumCredits aria-label="credit balance">{user.credits}</NumCredits>
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
  color: #a72020;
  font-weight: bold;
  font-size: 20px;
  margin-left: ${(props) => props.theme.spacing[7]};
`
