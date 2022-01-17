import React from 'react'
import {ComponentStory, ComponentMeta} from '@storybook/react'
import Rules from 'lib/ui/RulesConfig'

export default {
  title: 'Components/Rules',
  component: Rules,
} as ComponentMeta<typeof Rules>

export const NoRule: ComponentStory<typeof Rules> = (args) => (
  <Rules {...args} />
)

export const SimpleRules: ComponentStory<typeof Rules> = (args) => (
  <Rules {...args} />
)

SimpleRules.args = {
  rules: [
    {condition: 'And', source: 'Tags', type: 'include', target: 'ddd'},
    {
      condition: 'And',
      source: 'Group',
      type: 'is equel to',
      key: 'group',
      target: 'ddddd',
    },
    {
      condition: 'And',
      source: 'Group',
      type: 'is equel to',
      key: 'group',
      target: 'eee',
    },
  ],
}

export const NestedRules: ComponentStory<typeof Rules> = (args) => (
  <Rules {...args} />
)

NestedRules.args = {
  rules: [
    {condition: 'Or', source: 'Tags', type: 'include', target: 'ddd'},
    {
      condition: 'And',
      source: 'Group',
      type: 'is equel to',
      key: 'group',
      target: 'ddddd',
    },
    {
      condition: 'Or',
      source: 'Group',
      type: 'is equel to',
      key: 'group',
      target: 'eee',
    },
    {
      condition: 'And',
      rules: [
        {
          condition: 'And',
          source: 'Tags',
          type: 'include',
          target: 'nested tag 1',
        },
        {
          condition: 'Or',
          source: 'Group',
          type: 'is equel to',
          key: 'group',
          target: 'nested group 1',
        },
        {
          condition: 'And',
          rules: [
            {
              condition: 'And',
              source: 'Tags',
              type: 'include',
              target: 'double nested tag 1',
            },
            {
              condition: 'And',
              source: 'Group',
              type: 'is equel to',
              key: 'group',
              target: 'double nested group 1',
            },
          ],
          source: 'Nested Rule',
        },
      ],
      source: 'Nested Rule',
    },
  ],
}
