import faker from 'faker'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeCountDownTimer} from 'Event/Dashboard/components/CountDownTimer/__utils__/factory'
import {createHashMap, orderedIdsByPosition} from 'lib/list'
import {clickEdit} from '__utils__/edit'
import {fireEvent} from '@testing-library/react'
import {fakeEvent} from 'Event/__utils__/factory'
import {wait} from '@testing-library/react'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import axios from 'axios'
import {REMOVE} from 'Event/TemplateUpdateProvider'

const mockPut = axios.put as jest.Mock

afterEach(() => {
  jest.clearAllMocks()
})

it('should render count down timers', async () => {
  const countdownTimers = Array.from(
    {
      length: faker.random.number({min: 1, max: 4}),
    },
    fakeCountDownTimer,
  )

  const mainCountDownTimers = createHashMap(countdownTimers)
  const {findAllByLabelText} = await goToDashboardConfig({
    event: fakeEvent({
      template: fakePanels({
        countDownTimers: mainCountDownTimers,
      }),
    }),
  })

  const timersEls = await findAllByLabelText('count down timer')
  expect(timersEls.length).toBe(Object.keys(mainCountDownTimers).length)
})

it('should add a new count down timer', async () => {
  const numCountDownTimer = faker.random.number({min: 1, max: 4})

  const coundDownTimers = Array.from(
    {
      length: numCountDownTimer,
    },
    fakeCountDownTimer,
  )

  const mainCountDownTimers = createHashMap(coundDownTimers)
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
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}`)

  const values = Object.values(data.template)
  expect(values).toContain('#000000') // default text color
})

it('should remove the timer', async () => {
  const numCountDownTimer = faker.random.number({min: 2, max: 4})

  const timers = Array.from({length: numCountDownTimer}, fakeCountDownTimer)
  const mainTimers = createHashMap(timers)
  const event = fakeEvent({
    template: fakePanels({countDownTimers: mainTimers}),
  })

  const {findAllByLabelText, findByLabelText} = await goToDashboardConfig({
    event,
  })

  const timerEls = () => findAllByLabelText('count down timer')
  expect((await timerEls()).length).toBe(numCountDownTimer)

  const targetIndex = faker.random.number({min: 0, max: numCountDownTimer - 1})
  const target = (await timerEls())[targetIndex]

  clickEdit(target)

  fireEvent.click(await findByLabelText('remove countdown'))

  expect((await timerEls()).length).toBe(numCountDownTimer - 1)

  // Saved
  await wait(() => {
    expect(mockPut).toHaveBeenCalledTimes(1)
  })

  const [url, data] = mockPut.mock.calls[0]
  expect(url).toMatch(`/events/${event.slug}/template`)

  const ids = orderedIdsByPosition(mainTimers)
  const id = ids[targetIndex]
  expect(data.template[`countDownTimers.${id}`]).toBe(REMOVE)
})
