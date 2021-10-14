import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {CardsNavButtonProps} from 'Event/template/Cards/Dashboard/CardsNavButton'

export const fakeCardsNavButton = (
  overrides?: Partial<CardsNavButtonProps>,
): CardsNavButtonProps => ({
  ...fakeNavButton(),
  row: 1,
  iconSize: 30,
  ...overrides,
})
