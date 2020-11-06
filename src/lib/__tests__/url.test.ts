import {getSubdomain} from 'lib/url'

it('should return the correct subdomain', () => {
  expect(getSubdomain('sage.obv.io')).toBe('sage')
  expect(getSubdomain('foobar')).toBe('')
  expect(getSubdomain('obv.io')).toBe('')
  expect(getSubdomain('foo.sage.obv.io')).toBe('sage')
  expect(getSubdomain('foo.bar.baz.sage.obv.io')).toBe('sage')
})
