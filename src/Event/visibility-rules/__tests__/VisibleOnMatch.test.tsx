import VisibleOnMatch from 'Event/visibility-rules/VisibleOnMatch'
import AttendeeProfileProvider from 'Event/visibility-rules/AttendeeProfileProvider'
import React from 'react'
import faker from 'faker'
import {AND} from 'Event/visibility-rules'
import {render} from '__utils__/render'
import {
  DOES_NOT_INCLUDE,
  INCLUDE,
  TAGS,
} from 'Event/visibility-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should be visible without rules', async () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const {findByTestId} = render(
    <AttendeeProfileProvider groups={{}} tags={[]}>
      <VisibleOnMatch rules={[]}>
        <TestComponent />
      </VisibleOnMatch>
    </AttendeeProfileProvider>,
  )

  expect(await findByTestId(testId)).toBeInTheDocument()
})

it('should be visible on match', async () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const targetTag = faker.random.word()

  const {findByTestId} = render(
    <AttendeeProfileProvider groups={{}} tags={[targetTag]}>
      <VisibleOnMatch
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
      </VisibleOnMatch>
    </AttendeeProfileProvider>,
  )

  expect(await findByTestId(testId)).toBeInTheDocument()
})

it('should be be hidden', async () => {
  const testId = faker.random.word()
  const TestComponent = () => <div data-testid={testId}></div>

  const targetTag = faker.random.word()

  const {queryByTestId} = render(
    <AttendeeProfileProvider groups={{}} tags={[targetTag]}>
      <VisibleOnMatch
        rules={[
          {
            condition: AND,
            source: TAGS,
            type: DOES_NOT_INCLUDE, // make this rule a NOT match
            target: targetTag,
          },
        ]}
      >
        <TestComponent />
      </VisibleOnMatch>
    </AttendeeProfileProvider>,
  )

  expect(queryByTestId(testId)).not.toBeInTheDocument()
})
