import {icons} from 'lib/fontawesome/icons'
import TrieSearch from 'trie-search'

/**
 * The trie-search package converts an object into a trie. This
 * is done for search performance. Also tried using the array
 * method (addAll), but it resulted in duplicates.
 */
const mappedIcons = icons.reduce((acc, i) => {
  acc[i] = null
  return acc
}, {} as any)

const trie = new TrieSearch('key', {
  splitOnRegEx: /[-]/g,
  min: 3,
})

trie.addFromObject(mappedIcons)

export const findIcon = (value: string) => {
  return trie.search(value).map((res: {_key_: string}) => res._key_)
}
