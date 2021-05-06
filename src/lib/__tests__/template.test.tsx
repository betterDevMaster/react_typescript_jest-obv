import {render} from '@testing-library/react'
import {parseVariables, replace, useRemoveVariables} from 'lib/template'
import React from 'react'

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

it('should remove variables', () => {
  const text = `This is {{my}} text that {{includes}} many {variables}`
  const {queryByText, getByText} = render(
    <RemoveVariables>{text}</RemoveVariables>,
  )

  expect(queryByText(text)).toBeNull()

  // Has removed variables
  expect(getByText('This is text that many {variables}')).toBeInTheDocument()
})

/**
 * Helper Text Component to remove variables
 *
 * @param props
 * @returns
 */
function RemoveVariables(props: {children: string}) {
  const removeIn = useRemoveVariables()
  return <div>{removeIn(props.children)}</div>
}
