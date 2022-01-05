import React from 'react'
import Grid from '@material-ui/core/Grid'
import TeamMember, {TeamMemberProps} from 'lib/ui/TeamMembers/TeamMember'

export default function TeamMembers(props: {teamMembers: TeamMemberProps[]}) {
  const {teamMembers} = props

  return (
    <Grid container>
      {teamMembers.map((teamMember: TeamMemberProps, index: number) => {
        return (
          <Grid item xs={12} key={index}>
            <TeamMember
              teamMember={teamMember}
              isOdd={index % 2 !== 0}
              onClick={() => {}}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}
