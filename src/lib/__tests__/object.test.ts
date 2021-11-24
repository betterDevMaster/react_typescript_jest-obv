import {flatten} from 'lib/object'
import setProperty from 'lodash/set'

it('should flatten an object', () => {
  const aDate = new Date()

  expect(
    flatten({
      a: {
        b: 'foo',
        numbers: [1, 2, 3],
        notDefined: undefined,
        c: {
          deep: 'nested',
          someDate: aDate,
        },
      },
      baz: 1,
      empty: null,
      entities: {},
    }),
  ).toMatchObject({
    'a.b': 'foo',
    'a.numbers': [1, 2, 3],
    'a.c.deep': 'nested',
    'a.c.someDate': aDate,
    baz: 1,
    empty: null,
    'a.notDefined': undefined,
    entities: {},
  })
})

it('should ignore siblings', () => {
  const target = {
    sidebarItems: {
      entities: {
        1: {
          name: 'foo',
        },
      },
    },
  }

  setProperty(target, 'sidebarItems.entities.2', 'baz')
})
