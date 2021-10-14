import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeCountDownTimer} from 'Event/Dashboard/components/CountDownTimer/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should edit the selected timer', async () => {
  const timers = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeCountDownTimer,
  )

  const countDownTimers = createEntityList(timers)
  const event = fakeEvent({
    template: fakeCards({
      countDownTimers,
    }),
  })
  const {findByLabelText, findByText} = await goToDashboardConfig({event})

  const targetIndex = faker.random.number({min: 0, max: timers.length - 1})
  const timer = timers[targetIndex]
  const timerEl = await findByText(timer.description || '')

  clickEdit(timerEl)

  const textInput = (await findByLabelText(
    'description input',
  )) as HTMLInputElement
  expect(textInput.value).toBe(timer.description)

  const updatedValue = faker.random.word()

  fireEvent.change(textInput, {
    target: {
      value: updatedValue,
    },
  })

  fireEvent.click(await findByLabelText('save'))

  const updatedEl = await findByText(updatedValue)
  expect(updatedEl).toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  const id = data.template.countDownTimers.ids[targetIndex]
  expect(data.template.countDownTimers.entities[id].description).toBe(
    updatedValue,
  )
})

it('should remove a timer', async () => {
  const event = fakeEvent({
    template: fakeCards({
      countDownTimers: createEntityList([
        fakeCountDownTimer({
          description: 'first timer',
        }),
        fakeCountDownTimer({
          description: 'second timer',
        }),
      ]),
    }),
  })
  const {queryByText, findByText} = await goToDashboardConfig({event})

  const firstTimer = await findByText('first timer')

  clickEdit(firstTimer)

  user.click(await findByText(/remove/i))

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.countDownTimers.ids.length).toBe(1)

  await wait(() => {
    expect(queryByText('first timer')).not.toBeInTheDocument()
  })
})
