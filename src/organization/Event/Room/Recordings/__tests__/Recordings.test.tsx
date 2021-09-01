import user from '@testing-library/user-event'
import faker from 'faker'
import axios from 'axios'
import {fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {
  CONFIGURE_EVENTS,
  VIEW_RECORDINGS,
} from 'organization/PermissionsProvider'
import {Recording, RecordingList} from 'organization/Event/Room/Recordings'
import {now} from 'lib/date-time'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'

const mockGet = axios.get as jest.Mock

const fakeRecording = (overrides?: Partial<Recording>): Recording => ({
  name: 'Active Speaker',
  download_url: 'https://api.zoom.com/download/yourrecording',
  recording_start: now(),
  recording_end: now(),
  recording_type: 'active_speaker',
  file_size: 80000,
  file_type: 'M4A',
  ...overrides,
})

const fakeRecordingList = (
  overrides?: Partial<RecordingList>,
): RecordingList => ({
  meeting_uuid: faker.random.uuid(),
  recordings: [fakeRecording()],
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show recordings', async () => {
  const room = fakeRoom()

  const {findByLabelText, findByText} = await goToRoomConfig({
    room,
    userPermissions: [VIEW_RECORDINGS, CONFIGURE_EVENTS],
  })

  const recording = fakeRecording()
  const list: RecordingList = {
    meeting_uuid: 'uniquemeetingid',
    recordings: [recording],
  }

  mockGet.mockImplementationOnce(() => Promise.resolve({data: [list]}))

  user.click(await findByText(/recordings/i))

  const downloadButton = (await findByLabelText(
    'download main recording',
  )) as HTMLAnchorElement

  expect(downloadButton.href).toBe(recording.download_url)
})

it('should group by start times', async () => {
  const room = fakeRoom()

  const {findByText, findAllByLabelText, findAllByText} = await goToRoomConfig({
    room,
    userPermissions: [VIEW_RECORDINGS, CONFIGURE_EVENTS],
  })

  mockGet.mockImplementationOnce(() =>
    Promise.resolve({
      data: [
        fakeRecordingList({
          recordings: [
            /**
             * Create a list with 3 parts
             */
            fakeRecording({
              recording_start: '2021-09-01T03:00:01.000Z',
            }),
            fakeRecording({
              recording_start: '2021-09-01T03:00:02.000Z',
            }),
            fakeRecording({
              recording_start: '2021-09-01T03:00:03.000Z',
            }),
          ],
        }),
        fakeRecordingList({
          recordings: [fakeRecording()],
        }),
      ],
    }),
  )

  user.click(await findByText(/recordings/i))

  // Should include 3 parts + 1 single recording
  expect((await findAllByLabelText('download main recording')).length).toBe(4)

  expect((await findAllByText('Part:')).length).toBe(3)
})
