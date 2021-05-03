import {systemDefault, SYSTEM_DEFAULTS} from 'Event/LanguageProvider/system'

it('should find a nested key', () => {
  expect(systemDefault('unknownkey')).toBe(null)
  expect(systemDefault('waiver.submit')).toBe(SYSTEM_DEFAULTS.waiver.submit)
  expect(systemDefault('waiver')).toBe(null)
  expect(systemDefault('waiver.submit.unknownchild')).toBe(null)
})

it('should find top-level key', () => {
  expect(systemDefault('foo', {foo: 'bar'})).toBe('bar')
})

it('should find deeply nested keys', () => {
  expect(
    systemDefault('foo.bar.baz.quex', {
      foo: {
        bar: {
          baz: {
            quex: 'lol',
          },
        },
      },
    }),
  ).toBe('lol')
})
