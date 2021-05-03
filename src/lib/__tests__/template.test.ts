import {parseVariables, replace} from 'lib/template'

it('should find variables', () => {
  expect(parseVariables('{{foo}} is my {{bar}} baz')).toMatchObject([
    'foo',
    'bar',
  ])
})

it('should replace variables', () => {
  expect(
    replace('foo', 'bar', 'this is my {{foo}}, and this is also my {{foo}}'),
  ).toBe('this is my bar, and this is also my bar')
})
