import user from '@testing-library/user-event'
import axios from 'axios'
import faker from 'faker'
import {fakeArea, fakeRoom} from 'organization/Event/AreaList/__utils__/factory'
import {Room} from 'Event/room'
import {wait} from '@testing-library/react'
import {
  CONFIGURE_EVENTS,
  VIEW_RECORDINGS,
} from 'organization/PermissionsProvider'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {Recording, RecordingList} from 'organization/Event/Room/Recordings'
import {now} from 'lib/date-time'
import {goToRoomConfig} from 'organization/Event/Room/__utils__/go-to-room-config'

const mockGet = axios.get as jest.Mock
const mockPatch = axios.patch as jest.Mock

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
