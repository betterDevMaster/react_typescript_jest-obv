import Button from '@material-ui/core/Button'
import {useEvent} from 'Event/EventProvider'
import {api} from 'lib/url'
import {useOrganization} from 'organization/OrganizationProvider'
import React, {useState} from 'react'
import download from 'js-file-download'
import {Downloadable} from 'lib/ui/api-client'

export default function ExportLeaderboardButton(props: {
  onError: (error: string | null) => void
  className?: string
}) {
  const {exportLeaderboard, loading} = useExportLeaderboard(props.onError)

  return (
    <Button
      className={props.className}
      onClick={exportLeaderboard}
      variant="outlined"
      color="primary"
      aria-label="export leaderboard"
      disabled={loading}
    >
      Export Leaderboard
    </Button>
  )
}

function useExportLeaderboard(setError: (error: string | null) => void) {
  const [loading, setLoading] = useState<boolean>(false)

  const {client} = useOrganization()
  const {event} = useEvent()
  const url = api(`/events/${event.slug}/leaderboard/export`)

  const exportLeaderboard = () => {
    if (loading) {
      return
    }

    setLoading(true)
    setError(null)
    client
      .get<Downloadable>(url)
      .then((res) => {
        download(res.data, res.file_name)
      })
      .catch((e) => {
        setError(e.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {exportLeaderboard, loading}
}
