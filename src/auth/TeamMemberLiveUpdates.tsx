import FullPageLoader from 'lib/ui/layout/FullPageLoader'
import React, {useEffect} from 'react'
import {useObvioUser, useTeamMemberEcho} from 'obvio/auth'
import {TeamMember} from 'auth/user'
import {useDispatch} from 'react-redux'
import {setUser} from 'auth/actions'
import {usePrivateChannel} from 'lib/sockets/private-channel'

/**
 * Event names start with a '.' to prevent Laravel's
 * auto name-spacing event.
 *
 * Reference: https://laravel.com/docs/8.x/broadcasting#namespaces
 */
const TEAM_MEMBER_UPDATED = '.updated'

/**
 * Provides a socket to listen to live TeamMember updates for the
 * currently authenticated user.
 *
 * @param props
 * @returns
 */
export default function TeamMemberLiveUpdates(props: {
  children: React.ReactElement
}) {
  const echo = useTeamMemberEcho()
  const dispatch = useDispatch()

  const user = useObvioUser()

  // Event broadcasted on channel as specified in API
  const channelName = `team_member.${user.id}`

  const {socketId, channel, connected} = usePrivateChannel({
    echo,
    name: channelName,
  })

  // Bind event listeners
  useEffect(() => {
    if (!channel || !socketId) {
      return
    }

    channel.listen(TEAM_MEMBER_UPDATED, (data: TeamMember) => {
      dispatch(setUser(data))
    })

    return () => {
      channel.stopListening(TEAM_MEMBER_UPDATED)
    }
  }, [channel, socketId, dispatch])

  // Loading...
  if (!connected) {
    return <FullPageLoader />
  }

  return props.children
}
