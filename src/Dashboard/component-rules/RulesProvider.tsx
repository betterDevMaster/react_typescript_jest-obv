import {Groups} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/GroupRule/group-rule'
import {Tags} from 'Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule/tags-rule'
import React from 'react'

interface RulesContextProps {
  groups: Groups
  tags: Tags
}

const RulesContext = React.createContext(
  (undefined as unknown) as RulesContextProps,
)

export default function RulesProvider(props: {
  children: React.ReactNode
  groups: Groups
  tags: Tags
}) {
  return (
    <RulesContext.Provider
      value={{
        groups: props.groups,
        tags: props.tags,
      }}
    >
      {props.children}
    </RulesContext.Provider>
  )
}

export function useRulesData() {
  const context = React.useContext(RulesContext)
  if (context === undefined) {
    throw new Error('useRulesData must be used within a RulesProvider')
  }

  return context
}
