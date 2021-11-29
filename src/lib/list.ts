import {v4 as uuid} from 'uuid'

// Use this normalized entity list to reduce re-renders
// of cases where a list of entities should allow
// a single item to be editable individually.
export type EntityList<T> = {
  entities: Record<string, T>
  ids: string[]
}

export const createEntityList = <T>(items: T[]): EntityList<T> => {
  const list: EntityList<T> = {
    entities: {},
    ids: [],
  }

  for (const item of items) {
    const id = uuid()
    list.entities[id] = item
    list.ids.push(id)
  }

  return list
}

export type HashMap<T> = Record<string, T>

export const createHashMap = <T>(items: T[]): Record<string, T> => {
  return items.reduce((acc, i) => {
    const id = uuid()
    acc[id] = i

    return acc
  }, {} as Record<string, T>)
}

export type Ordered = {
  // Position starts off as undefined, and we'll sort those last by default. This
  // prevents any position discrepencies between clients from inserting an item
  // in any position other than last.
  position?: number
}

// Returns the ids in an array sorted by their position property.
export function orderedIdsByPosition(items: HashMap<Ordered>) {
  return Object.entries(items)
    .sort(([aId, {position: aPosition}], [bId, {position: bPosition}]) => {
      // Place items without positions last
      if (!aPosition) {
        return 1
      }

      if (!bPosition) {
        return -1
      }

      return aPosition - bPosition
    })
    .map(([id]) => id)
}

// Converts an ordered array of ids into a collection of
// objects with positions according to their index.
export function createPositions<T extends string | number>(ids: T[]) {
  return ids.reduce((acc, id, index) => {
    acc[id] = {position: index + 1}
    return acc
  }, {} as Record<T, {position: number}>)
}
