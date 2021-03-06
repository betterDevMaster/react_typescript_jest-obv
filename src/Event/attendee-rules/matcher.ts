import {useAttendeeProfile} from 'Event/attendee-rules/AttendeeProfileProvider'
import {AND, OR, Rule} from 'Event/attendee-rules'
import {matchesTagsRule} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule/matcher'
import {NESTED_RULE} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/NestedRule'
import {GROUP} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule'
import {matchesGroupRule} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule/matcher'
import {TAGS} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'
import {Groups, Tags} from 'Event/attendee'

export const hasMatch = (
  {groups = {}, tags = []}: {groups?: Groups; tags?: Tags},
  rules: Rule[],
): boolean =>
  rules.reduce((alreadyMatched: boolean, r: Rule, i: number) => {
    const isMatch = isTrue(groups, tags, r)
    switch (r.condition) {
      case AND:
        const isFirst = i === 0
        return isFirst ? isMatch : alreadyMatched && isMatch
      case OR:
        return alreadyMatched || isMatch
      default:
        throw new Error(`Unimplemented rule operator: ${r.condition}`)
    }
  }, false)

function isTrue(groups: Groups, tags: Tags, r: Rule) {
  switch (r.source) {
    case NESTED_RULE:
      return hasMatch({groups, tags}, r.rules)
    case GROUP:
      return matchesGroupRule(groups, r)
    case TAGS:
      return matchesTagsRule(tags, r)
  }
}

/**
 * Check whether there is at least one visible item
 * @param resources
 * @returns
 */
export function useHasVisibleItems(items: {rules?: Rule[]}[]) {
  const {groups, tags} = useAttendeeProfile()

  return (
    items.filter(({rules}) => {
      if (!rules || rules.length === 0) {
        return true
      }

      return hasMatch({groups, tags}, rules)
    }).length > 0
  )
}
