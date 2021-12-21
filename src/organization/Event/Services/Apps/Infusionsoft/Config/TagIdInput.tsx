import {
  ATTENDEE_CREATED,
  ATTENDEE_CHECKED_IN,
  ATTENDEE_SIGNED_WAIVER,
  IMPORT_TAG,
  Tag,
} from 'organization/Event/Services/Apps/Infusionsoft'
import React, {useEffect, useState} from 'react'
import TagsAutocomplete from 'organization/Event/Services/Apps/Infusionsoft/Config/TagsAutocomplete'
import {InfusionsoftTag} from 'Event/infusionsoft'

export default function TagIdInput(props: {
  tag: Tag
  onChange: (tag: Tag) => void
  error?: string
}) {
  const {tag} = props
  const [
    infusionsoftTag,
    setInfusionsoftTag,
  ] = useState<InfusionsoftTag | null>(null)

  useEffect(() => {
    if (!tag.infusionsoft_id || !tag.name) {
      setInfusionsoftTag(null)
      return
    }

    setInfusionsoftTag({
      id: tag.infusionsoft_id,
      name: tag.name,
    })
  }, [tag])

  const handleTagSelect = (selected: InfusionsoftTag | null) => {
    if (!selected) {
      const empty = {
        ...tag,
        name: null,
        infusionsoft_id: null,
      }

      props.onChange(empty)
      return
    }

    const updated = {
      ...tag,
      name: selected.name,
      infusionsoft_id: selected.id,
    }

    props.onChange(updated)
  }

  return (
    <TagsAutocomplete
      errorText={props.error}
      inputVariant={'outlined'}
      inputLabel={label(tag)}
      value={infusionsoftTag}
      onChange={handleTagSelect}
    />
  )
}

function label(tag: Tag) {
  const isSet = Boolean(tag.name)
  return isSet ? `${typeLabel(tag)} - ${tag.name}` : `${typeLabel(tag)}`
}

function typeLabel(tag: Tag) {
  const labels: Record<string, string> = {
    [ATTENDEE_CREATED]: 'Attendee Created',
    [ATTENDEE_SIGNED_WAIVER]: 'Attendee Signed Waiver',
    [ATTENDEE_CHECKED_IN]: 'Attendee Checked In',
    [IMPORT_TAG]: 'Import Tag',
  }

  const label = labels[tag.type]
  if (!label) {
    throw new Error(`Label not defined for tag type: ${tag.type}`)
  }

  return label
}
