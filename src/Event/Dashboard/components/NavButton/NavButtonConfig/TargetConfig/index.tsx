import FormControl from '@material-ui/core/FormControl'
import React from 'react'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import AreaConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/AreaConfig'
import LinkConfig from 'Event/Dashboard/components/NavButton/NavButtonConfig/TargetConfig/LinkConfig'

export type TargetConfigProps = {
  disablePageSelect?: boolean
  isAreaButton: boolean
  setIsAreaButton: (isAreaButton: boolean) => void
  areaId: string | null
  setAreaId: (areaId: string | null) => void
  link: string
  setLink: (link: string) => void
  page?: string | null
  setPage: (page: string | null) => void
  newTab?: boolean
  setNewTab: (newTab: boolean) => void
}

export default function TargetConfig(props: TargetConfigProps) {
  const {setIsAreaButton, isAreaButton} = props

  return (
    <>
      <FormControl>
        <ToggleButtonGroup value={isAreaButton ? 'true' : 'false'} exclusive>
          <ToggleButton value="false" onClick={() => setIsAreaButton(false)}>
            Link
          </ToggleButton>
          <ToggleButton
            value="true"
            aria-label="configure button to join room"
            onClick={() => setIsAreaButton(true)}
          >
            Join Area
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      <LinkConfig {...props} />
      <AreaConfig {...props} />
    </>
  )
}
