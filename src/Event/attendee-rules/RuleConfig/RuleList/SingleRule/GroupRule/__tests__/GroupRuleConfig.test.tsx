import RuleConfig from 'Event/attendee-rules/RuleConfig'
import faker from 'faker'
import user from '@testing-library/user-event'
import React from 'react'
import {inputElementFor, render} from '__utils__/render'
import {AND} from 'Event/attendee-rules'
import {fireEvent} from '@testing-library/react'
import {
  GROUP,
  IS,
} from 'Event/attendee-rules/RuleConfig/RuleList/SingleRule/GroupRule'

it('should add a group rule', async () => {
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

  fireEvent.change(inputElementFor(await findByLabelText('pick rule source')), {
    target: {
      value: GROUP,
    },
  })

  fireEvent.change(
    inputElementFor(await findByLabelText('pick group rule type')),
    {
      target: {
        value: IS,
      },
    },
  )

  const target = faker.random.word()
  user.type(await findByLabelText('new group target'), target)

  user.click(await findByLabelText('save rule'))

  expect(updateRules).toHaveBeenCalledTimes(1)
  const addedRule = updateRules.mock.calls[0][0][0]
  expect(addedRule.condition).toBe(AND)
  expect(addedRule.type).toBe(IS)
  expect(addedRule.target).toBe(target)
})
