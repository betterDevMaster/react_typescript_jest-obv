import {render} from '@testing-library/react'
import HiddenOnMatch from 'Dashboard/rule/HiddenOnMatch'
import RulesDataProvider from 'Dashboard/rule/RulesDataProvider'
import React from 'react'
import faker from 'faker'
import {AND} from 'Dashboard/rule'
import {TAGS} from 'Dashboard/rule/tags'

it('should render depending on rule match', () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const {queryByTestId, rerender} = render(
    <RulesDataProvider groups={{}} tags={[]}>
      <HiddenOnMatch rules={[]}>
        <TestComponent />
      </HiddenOnMatch>
    </RulesDataProvider>,
  )

  expect(queryByTestId(testId)).toBeInTheDocument()

  const targetTag = faker.random.word()
  rerender(
    <RulesDataProvider groups={{}} tags={[targetTag]}>
      <HiddenOnMatch
        rules={[
          {
            condition: AND,
            source: TAGS,
            type: 'INCLUDES',
            target: targetTag,
          },
        ]}
      >
        <TestComponent />
      </HiddenOnMatch>
    </RulesDataProvider>,
  )

  expect(queryByTestId(testId)).not.toBeInTheDocument()
})
