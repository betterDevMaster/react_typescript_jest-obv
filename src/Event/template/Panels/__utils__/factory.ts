import {createPanels, Panels} from 'Event/template/Panels'

export const fakePanels = (overrides?: Partial<Panels>): Panels => ({
  ...createPanels(),
  ...overrides,
})
