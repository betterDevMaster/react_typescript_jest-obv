import {Rule} from 'Event/visibility-rules'
import {hasMatch} from 'Event/visibility-rules/matcher'
import {useAttendeeProfile} from 'Event/visibility-rules/AttendeeProfileProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function HiddenOnMatch(props: {
  rules?: Rule[]
  children: React.ReactElement
}) {
  const {groups, tags} = useAttendeeProfile()
  const isEditMode = useEditMode()

  if (isEditMode || !props.rules) {
    // Always show in edit mode or it would
    // be pretty difficult to configure a hidden component.
    return props.children
  }

  const hide = hasMatch({groups, tags}, props.rules)
  if (hide) {
    return null
  }

  return props.children
}
