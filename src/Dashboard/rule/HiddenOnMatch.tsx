import {hasMatch, Rule} from 'Dashboard/rule'
import {useRulesData} from 'Dashboard/rule/RulesDataProvider'

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
