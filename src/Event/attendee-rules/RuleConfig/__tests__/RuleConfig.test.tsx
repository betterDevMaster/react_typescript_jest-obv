import React from 'react'
import faker from 'faker'
import RuleConfig from 'Event/attendee-rules/RuleConfig'
import {inputElementFor, render} from '__utils__/render'
import user from '@testing-library/user-event'
import {fireEvent} from '@testing-library/react'
import {AND} from 'Event/attendee-rules'
import {
  INCLUDE,
  TAGS,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/TagsRule'

it('should show config, and hide child content', async () => {
  const {rerender, findByTestId, queryByTestId, findByText} = render(
    <RuleConfig rules={[]} onChange={() => {}} visible={false} close={() => {}}>
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  expect(await findByTestId('child-component')).toBeInTheDocument()

  rerender(
    <RuleConfig rules={[]} onChange={() => {}} visible={true} close={() => {}}>
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  expect(queryByTestId('child-component')).not.toBeInTheDocument()

  expect(await findByText('Add Rule')).toBeInTheDocument()
})

it('should add a rule', async () => {
  const updateRules = jest.fn()

  const {findByLabelText} = render(
    <RuleConfig
      rules={[]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(await findByLabelText('add rule'))

  // Select tags as source
  fireEvent.change(inputElementFor(await findByLabelText('pick rule source')), {
    target: {
      value: TAGS,
    },
  })

  const target = faker.random.word()
  user.type(await findByLabelText('new tag target'), target)

  user.click(await findByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)
  expect(addedRule.type).toBe(INCLUDE)
  expect(addedRule.target).toBe(target)
})

it('should edit an existing rule', async () => {
  const updateRules = jest.fn()

  const originalTarget = faker.random.word()
  const {findByLabelText, getByText} = render(
    <RuleConfig
      rules={[
        {
          source: TAGS,
          condition: AND,
          type: INCLUDE,
          target: originalTarget,
        },
      ]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(getByText(new RegExp(originalTarget)))

  const newTarget = faker.random.word()
  user.type(await findByLabelText('new tag target'), newTarget)

  user.click(await findByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const updated = updateRules.mock.calls[0][0][0]
  expect(updated.target).toBe(newTarget)
})

it('should delete an existing rule', async () => {
  const updateRules = jest.fn()

  const target = faker.random.word()
  const {findByLabelText, getByText} = render(
    <RuleConfig
      rules={[
        {
          source: TAGS,
          condition: AND,
          type: INCLUDE,
          target,
        },
      ]}
      onChange={updateRules}
      visible={true}
      close={() => {}}
    >
      <div data-testid="child-component"></div>
    </RuleConfig>,
  )

  user.click(getByText(new RegExp(target)))
  user.click(await findByLabelText('remove rule'))
  const rules = updateRules.mock.calls[0][0]
  expect(rules).toMatchObject([])
})
