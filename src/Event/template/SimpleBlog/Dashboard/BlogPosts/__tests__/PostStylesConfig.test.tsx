import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'
import user from '@testing-library/user-event'
import {fakeEvent} from 'Event/__utils__/factory'
import {goToDashboardConfig} from 'organization/Event/DashboardConfig/__utils__/go-dashboard-config'
import faker from 'faker'
import {createEntityList} from 'lib/list'
import {fakeBlogPost} from 'Event/Dashboard/components/BlogPost/__utils__/factory'

it('should edit post styles', async () => {
  const event = fakeEvent({
    template: fakeSimpleBlog({
      blogPosts: createEntityList([fakeBlogPost()]),
    }),
  })
  const {findByLabelText} = await goToDashboardConfig({
    event,
  })

  user.click(await findByLabelText('style posts'))

  const color = faker.internet.color()
  user.type(await findByLabelText('date text color'), color)

  expect(await findByLabelText('post date')).toHaveStyle(`color: ${color}`)
})
