import HiddenOnMatch from 'organization/event/Dashboard/component-rules/HiddenOnMatch'
import RulesProvider from 'organization/event/Dashboard/component-rules/RulesProvider'
import React from 'react'
import faker from 'faker'
import {AND} from 'organization/event/Dashboard/component-rules'
import {render} from '__utils__/render'
import {
  INCLUDE,
  TAGS,
} from 'organization/event/Dashboard/component-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should render depending on rule match', () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const {queryByTestId, rerender} = render(
    <RulesProvider groups={{}} tags={[]}>
      <HiddenOnMatch rules={[]}>
        <TestComponent />
      </HiddenOnMatch>
    </RulesProvider>,
  )

  expect(queryByTestId(testId)).toBeInTheDocument()

  const targetTag = faker.random.word()
  rerender(
    <RulesProvider groups={{}} tags={[targetTag]}>
      <HiddenOnMatch
        rules={[
          {
            condition: AND,
            source: TAGS,
            type: INCLUDE,
            target: targetTag,
          },
        ]}
      >
        <TestComponent />
      </HiddenOnMatch>
    </RulesProvider>,
  )

  expect(queryByTestId(testId)).not.toBeInTheDocument()
})
