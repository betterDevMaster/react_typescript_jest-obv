import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeCountDownTimer} from 'Event/Dashboard/components/CountDownTimer/__utils__/factory'
import {createEntityList} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {mockRxJsAjax} from 'store/__utils__/MockStoreProvider'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'

const mockPost = mockRxJsAjax.post as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

it('should render count down timers', async () => {
  const countdownTimers = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeCountDownTimer,
  )

  const mainCountDownTimers = createEntityList(countdownTimers)
  const {findAllByLabelText} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakePanels({
        countDownTimers: mainCountDownTimers,
      }),
    }),
  })

  const timersEls = await findAllByLabelText('count down timer')
  expect(timersEls.length).toBe(mainCountDownTimers.ids.length)
})

it('should add a new count down timer', async () => {
  const numCountDownTimer = faker.random.number({min: 1, max: 4})

  const coundDownTimers = Array.from(
    {
      length: numCountDownTimer,
    },
    fakeCountDownTimer,
  )

  const mainCountDownTimers = createEntityList(coundDownTimers)
  const event = fakeEvent({
    template: fakePanels({
      countDownTimers: mainCountDownTimers,
    }),
  })

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const timerEls = () => findAllByLabelText('count down timer')

  expect((await timerEls()).length).toBe(numCountDownTimer)

  fireEvent.click(await findByLabelText('add count down timer'))
  fireEvent.click(await findByLabelText('save'))

  await wait(async () => {
    expect((await timerEls()).length).toBe(numCountDownTimer + 1)
  })

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.countDownTimers.ids.length).toBe(numCountDownTimer + 1)
})

it('should remove the timer', async () => {
  const numCountDownTimer = faker.random.number({min: 2, max: 4})

  const timers = Array.from({length: numCountDownTimer}, fakeCountDownTimer)
  const mainTimers = createEntityList(timers)
  const event = fakeEvent({
    template: fakePanels({countDownTimers: mainTimers}),
  })

  const {
    findAllByLabelText,
    findByLabelText,
    queryByText,
  } = await goToDashboardConfig({event})

  const timerEls = () => findAllByLabelText('count down timer')
  expect((await timerEls()).length).toBe(numCountDownTimer)

  const target = faker.random.arrayElement(await timerEls())
  expect(queryByText(target.textContent!)).toBeInTheDocument()

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove countdown'))

  expect((await timerEls()).length).toBe(numCountDownTimer - 1)

  expect(queryByText(target.textContent!)).not.toBeInTheDocument()

  // Saved
  await wait(() => {
    expect(mockPost).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPost.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)
  expect(data.template.countDownTimers.ids.length).toBe(numCountDownTimer - 1)
})
