import faker from 'faker'
import user from '@testing-library/user-event'
import {fakeRole} from 'organization/Team/Roles/__utils__/factory'
import {ALL_PERMISSIONS} from 'organization/__utils__/factory'
import {label} from 'organization/PermissionsProvider'
import {goToTeams} from 'organization/Team/__utils__/go-to-teams-page'

it('should show permissions table', async () => {
  const roles = new Array(faker.random.number({min: 1, max: 4}))
    .fill(null)
    .map((_, index) => fakeRole({name: `${index}_${faker.random.word()}`}))

  const {findByText, findAllByLabelText} = await goToTeams({roles})

  user.click(await findByText(/roles/i))

  // shows all rows
  for (const role of roles) {
    expect(await findByText(new RegExp(role.name))).toBeInTheDocument()
  }

  // shows all permissions
  for (const permission of ALL_PERMISSIONS) {
    expect(await findByText(new RegExp(label(permission)))).toBeInTheDocument()
  }

  // shows permission checkbox
  const numCheckboxes = roles.length * ALL_PERMISSIONS.length
  expect((await findAllByLabelText('toggle permission')).length).toBe(
    numCheckboxes,
  )
})
