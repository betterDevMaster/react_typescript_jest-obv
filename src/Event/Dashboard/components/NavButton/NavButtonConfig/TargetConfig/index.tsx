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
  isImageUpload: boolean
  setIsImageUploadButton: (isImageUploadButton: boolean) => void
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
  const {
    setIsAreaButton,
    isAreaButton,
    setIsImageUploadButton,
    isImageUpload,
  } = props

  const value = () => {
    if (isImageUpload) {
      return 2
    }

    if (isAreaButton) {
      return 1
    }

    return 0
  }

  return (
    <>
      <FormControl>
        <ToggleButtonGroup value={value()} exclusive>
          <ToggleButton
            value={0}
            onClick={() => {
              setIsAreaButton(false)
              setIsImageUploadButton(false)
            }}
          >
            Link
          </ToggleButton>
          <ToggleButton
            value={1}
            aria-label="configure button to join room"
            onClick={() => {
              setIsAreaButton(true)
              setIsImageUploadButton(false)
            }}
          >
            Join Area
          </ToggleButton>
          <ToggleButton
            value={2}
            aria-label="configure button to image upload"
            onClick={() => {
              setIsImageUploadButton(true)
              setIsAreaButton(false)
            }}
          >
            Image Uploader
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
      <LinkConfig {...props} />
      <AreaConfig {...props} />
    </>
  )
}
