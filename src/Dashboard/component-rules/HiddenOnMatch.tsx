import {hasMatch, Rule} from 'Dashboard/component-rules/sources'
import {useRulesData} from 'Dashboard/component-rules/RulesDataProvider'

export default function HiddenOnMatch(props: {
  rules: Rule[]
  children: React.ReactElement
}) {
  const {groups, tags} = useRulesData()

  if (hasMatch({groups, tags}, props.rules)) {
    return null
  }

  return props.children
}
