import {hasMatch, Rule} from 'Dashboard/component-rules/sources'
import {useRulesData} from 'Dashboard/component-rules/RulesProvider'
import {useEditMode} from 'editor/state/edit-mode'

export default function HiddenOnMatch(props: {
  rules: Rule[]
  children: React.ReactElement
}) {
  const {groups, tags} = useRulesData()
  const isEditMode = useEditMode()

  if (isEditMode) {
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
