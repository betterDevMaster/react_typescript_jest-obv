import faker from 'faker'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'
import {CHECK_IN_ATTENDEES, START_ROOMS} from 'organization/PermissionsProvider'

it('should render list of areas', async () => {
  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  const {findByText} = await goToAreas({areas, userPermissions: [START_ROOMS]})

  for (const area of areas) {
    expect(await findByText(area.name)).toBeInTheDocument()
  }
})

it('should only show tech check area', async () => {
  const techCheck = fakeArea({is_tech_check: true})
  const normalAreas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    () => fakeArea({is_tech_check: false}),
  )

  const {findAllByLabelText} = await goToAreas({
    areas: [techCheck, ...normalAreas],
    userPermissions: [CHECK_IN_ATTENDEES],
  })

  expect((await findAllByLabelText(/view.*area/)).length).toBe(1)
})
