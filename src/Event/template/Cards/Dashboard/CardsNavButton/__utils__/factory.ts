import {fakeNavButton} from 'Event/Dashboard/components/NavButton/__utils__/factory'
import {CardsNavButtonProps} from 'Event/template/Cards/Dashboard/CardsNavButton'
import {createHashMap, orderedIdsByPosition} from 'lib/list'
import faker from 'faker'

export const fakeCardsNavButton = (
  overrides?: Partial<CardsNavButtonProps>,
): CardsNavButtonProps => ({
  ...fakeNavButton(),
  row: 1,
  iconSize: 30,
  ...overrides,
})

export const fakeCardsNavButtons = (buttons: CardsNavButtonProps[]) => {
  const mainNavButtons = createHashMap(buttons)
  const targetIndex = faker.random.number({min: 0, max: buttons.length - 1})

  const ids = orderedIdsByPosition(mainNavButtons)
  const targetId = ids[targetIndex]

  return {buttonsMap: mainNavButtons, targetIndex, targetId}
}
