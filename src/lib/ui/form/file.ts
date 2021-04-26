import {PublicFile} from 'lib/http-client'
import {useState} from 'react'

export type FileSelect = ReturnType<typeof useFileSelect>

/**
 * Handle file selects where the model accepts the following
 * cases for the file property:
 *
 * 1. File set - save/replace file
 * 2. null - remove existing file
 * 3. none/unset - do nothing, keep existing file if exists
 *A
 * @param current
 * @returns
 */
export function useFileSelect(current?: PublicFile | null) {
  const [file, setFile] = useState<null | File>(null)
  const [wasRemoved, setWasRemoved] = useState(false)

  const select = (image: File) => {
    setFile(image)
    setWasRemoved(false)
  }

  const remove = () => {
    setWasRemoved(true)
    setFile(null)
  }

  const canUpload = () => {
    if (wasRemoved) {
      return true
    }

    const hasImageSet = Boolean(current) || Boolean(file)
    return !hasImageSet
  }

  const exists = Boolean(file) || Boolean(current)

  return {
    current,
    select,
    selected: file,
    remove,
    canUpload: canUpload(),
    wasRemoved,
    canRemove: exists && !wasRemoved,
  }
}
