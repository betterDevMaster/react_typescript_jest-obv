import {createNiftyFifty, NiftyFifty} from 'Event/template/NiftyFifty'

export const fakeNiftyFifty = (
  overrides?: Partial<NiftyFifty>,
): NiftyFifty => ({
  ...createNiftyFifty(),
  ...overrides,
})
