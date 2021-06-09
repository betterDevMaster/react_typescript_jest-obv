import {fireEvent} from '@testing-library/react'
import {fakeAttendee} from 'Event/auth/__utils__/factory'
import {loginToEventSite} from 'Event/__utils__/url'
import axios from 'axios'
import {Await} from 'lib/type-utils'
import {Attendee} from 'Event/attendee'

const mockPost = axios.post as jest.Mock

export async function submitWaiver({
  findByLabelText,
  attendee,
}: Await<ReturnType<typeof loginToEventSite>> & {attendee?: Attendee}) {
  const canvas = (await findByLabelText(
    'signature canvas',
  )) as unknown as HTMLCanvasElement

  const signature = 'data:image/png;base64'
  //@ts-ignore
  canvas.toDataURL.mockReturnValueOnce(signature) // mocked via jest-canvas-mock

  const down = new MouseEvent('mousedown', {
    button: 1,
    bubbles: true,
  })

  Object.defineProperty(down, 'which', {
    value: 1,
  })

  fireEvent(canvas, down)

  const up = new MouseEvent('mouseup', {
    button: 1,
    bubbles: true,
  })

  // Have to manually set 'which' because that's what SignaturePad uses
  // to check the mouse button
  Object.defineProperty(up, 'which', {
    value: 1,
  })

  fireEvent(canvas, up)

  fireEvent.click(await findByLabelText('agree to waiver checkbox'))

  const withWaver =
    attendee ||
    fakeAttendee({
      has_password: true,
      waiver: 'waiver.jpg',
    })
  mockPost.mockImplementationOnce(() => Promise.resolve({data: withWaver}))

  fireEvent.click(await findByLabelText('submit'))
}
