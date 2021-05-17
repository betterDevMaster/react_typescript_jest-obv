import React from 'react'
import user from '@testing-library/user-event'
import faker from 'faker'
import {render} from '__utils__/render'
import TagsInput from 'lib/ui/form/TagsInput'
import {fireEvent} from '@testing-library/react'

it('should render initial tags', async () => {
  const tags = new Array(faker.random.number({min: 1, max: 4}))
    .fill(null)
    .map((_, index) => `${index}_${faker.random.word()}`) // Prepend index to ensure uniquenes

  const {findAllByLabelText, findByText} = render(
    <TagsInput value={tags} name="tags" onChange={() => {}} />,
  )

  expect((await findAllByLabelText('tag')).length).toBe(tags.length)

  for (const tag of tags) {
    expect(await findByText(tag)).toBeInTheDocument()
  }
})

it('should add a new tag', async () => {
  const onChange = jest.fn()
  const label = 'my tags'
  const {findByLabelText} = render(
    <TagsInput name="tags" aria-label={label} onChange={onChange} />,
  )

  const tag = faker.random.word()
  user.type(await findByLabelText(label), tag)

  fireEvent.keyDown(await findByLabelText(label), {key: 'Enter', code: 13})

  expect((await findByLabelText('tag')).textContent).toBe(tag)

  expect(onChange).toHaveBeenCalledTimes(2)

  const [added] = onChange.mock.calls[1][0]
  expect(added).toBe(tag)
})

it('should remove the last tag', async () => {
  const onChange = jest.fn()
  const label = 'my tags'

  const tags = new Array(faker.random.number({min: 2, max: 4}))
    .fill(null)
    .map((_, index) => `${index}_${faker.random.word()}`)

  const {findAllByLabelText, findByLabelText} = render(
    <TagsInput
      value={tags}
      name="tags"
      aria-label={label}
      onChange={onChange}
    />,
  )

  fireEvent.keyDown(await findByLabelText(label), {key: 'Backspace'})

  expect((await findAllByLabelText('tag')).length).toBe(tags.length - 1)

  expect(onChange).toHaveBeenCalledTimes(2)

  // Did remove from array
  const last = tags[tags.length - 1]
  const updated = onChange.mock.calls[1][0]
  expect(updated.includes(last)).toBe(false)
})

it('should remove a specific tag', async () => {
  const onChange = jest.fn()
  const label = 'my tags'

  const tags = new Array(faker.random.number({min: 2, max: 5}))
    .fill(null)
    .map((_, index) => `${index}_${faker.random.word()}`)

  const {findAllByLabelText, findByText, queryByText} = render(
    <TagsInput
      value={tags}
      name="tags"
      aria-label={label}
      onChange={onChange}
    />,
  )

  const target = faker.random.arrayElement(tags)

  // MUI Chip has the 'x' svg next to the label text
  fireEvent.click((await findByText(target)).nextSibling as HTMLElement)

  expect((await findAllByLabelText('tag')).length).toBe(tags.length - 1)

  expect(queryByText(target)).not.toBeInTheDocument()

  expect(onChange).toHaveBeenCalledTimes(2)

  // Did remove from array
  const updated = onChange.mock.calls[1][0]
  expect(updated.includes(target)).toBe(false)
})
