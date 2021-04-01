import faker from 'faker'
import {fakeArea} from 'organization/Event/AreaList/__utils__/factory'
import {goToAreas} from 'organization/Event/AreaList/__utils__/go-to-areas'

it('should render list of areas', async () => {
  const areas = Array.from(
    {length: faker.random.number({min: 1, max: 5})},
    fakeArea,
  )

  const {findByText} = await goToAreas({areas})

  for (const area of areas) {
    expect(await findByText(area.name)).toBeInTheDocument()
  }
})
