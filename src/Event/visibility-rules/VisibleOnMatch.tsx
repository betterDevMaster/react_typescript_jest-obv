import {Rule} from 'Event/visibility-rules'
import {hasMatch} from 'Event/visibility-rules/matcher'
import {useAttendeeProfile} from 'Event/visibility-rules/AttendeeProfileProvider'
import {useEditMode} from 'Event/Dashboard/editor/state/edit-mode'

export default function VisibleOnMatch(props: {
  rules?: Rule[]
  children: React.ReactElement
}) {
  const {groups, tags} = useAttendeeProfile()
  const isEditMode = useEditMode()

  /**
   * Always show component in edit mode, otherwise it would be pretty
   * difficult to configure.
   */
  if (isEditMode) {
    return props.children
  }

  /**
   * If no rules have been configured, the default should be to SHOW the
   * component.
   */
  if (!props.rules || props.rules.length === 0) {
    return props.children
  }

  const showing = hasMatch({groups, tags}, props.rules)
  if (!showing) {
    return null
  }

  return props.children
}
