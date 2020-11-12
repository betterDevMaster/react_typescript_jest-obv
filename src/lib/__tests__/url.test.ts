import {createRoutes, getSubdomain} from 'lib/url'

it('should return the correct subdomain', () => {
  expect(getSubdomain('sage.obv.io')).toBe('sage')
  expect(getSubdomain('foobar')).toBe('')
  expect(getSubdomain('obv.io')).toBe('')
  expect(getSubdomain('foo.sage.obv.io')).toBe('sage')
  expect(getSubdomain('foo.bar.baz.sage.obv.io')).toBe('sage')
})

it('should namespace routes', () => {
  const routes = createRoutes({
    foo: '/foo',
    bar: {
      baz: '/baz',
      quex: {
        quz: '/quz',
        grand_child: {
          great_grand_child: '/great_grand_child',
        },
      },
    },
  })

  expect(routes.root).toBe('/')
  expect(routes.foo).toBe('/foo')
  expect(routes.bar.root).toBe('/bar')
  expect(routes.bar.baz).toBe('/bar/baz')
  expect(routes.bar.quex.root).toBe('/bar/quex')
  expect(routes.bar.quex.quz).toBe('/bar/quex/quz')
  expect(routes.bar.quex.grand_child.great_grand_child).toBe(
    '/bar/quex/grand_child/great_grand_child',
  )
  expect(routes.bar.quex.grand_child.root).toBe('/bar/quex/grand_child')
})
