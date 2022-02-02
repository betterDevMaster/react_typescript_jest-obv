import {Template} from 'Event/template'
import {fakeCards} from 'Event/template/Cards/__utils__/factory'
import {fakePanels} from 'Event/template/Panels/__utils__/factory'
import {fakeSimpleBlog} from 'Event/template/SimpleBlog/__utils__/factory'

// Props that exist in all templates. Pick props out here
// to be tested in functions that take a generic
// template factory.
type GlobalTemplateProps = Pick<Template, 'blogPosts'>

type TemplateFactory = (overrides?: Partial<GlobalTemplateProps>) => Template

/**
 * Test runner function that will run the provided function against all
 * defined templates.
 * @param title
 * @param testFn
 */
export const allTemplates = (
  title: string,
  testFn: (fakeTemplate: TemplateFactory) => Promise<void>,
) => {
  test.each([
    ['SimpleBlog', fakeSimpleBlog],
    ['Panels', fakePanels],
    ['Cards', fakeCards],
  ])(`%s: ${title}`, async (_, fakeTemplate) => {
    await testFn(fakeTemplate)
  })
}
