export function guardValidDimensions(aspectRatio: number) {
  return (file: File) => {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader()

      reader.onloadend = () => {
        if (reader.result === null) {
          return reject('Image could not be read. Please try again. [201]')
        }

        let imageInfo = new Image()
        imageInfo.src = reader.result.toString()

        imageInfo.onload = () => {
          if (imageInfo.width === 0 || imageInfo.height === 0) {
            return reject('Image could not be read. Please try again. [202]')
          }

          if (imageInfo.height / imageInfo.width !== aspectRatio) {
            return reject(
              'Aspect ratio of Zoom Background Images needs to be 16:9. [203]',
            )
          }

          return resolve(file)
        }
      }

      reader.readAsDataURL(file)
    })
  }
}

export function guardValidMimeType(file: File) {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      if (reader.result === null) {
        reject('Image could not be read. Please try again. [101]')
        return false
      }

      const uint = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4)
      let bytes = ''
      uint.forEach((byte) => {
        bytes += byte.toString(16)
      })
      const hex = bytes.toUpperCase()

      switch (hex) {
        case '89504E47': // type = "image/png";
        case 'FFD8FFE0': // type = "image/jpeg";
        case 'FFD8FFE1':
        case 'FFD8FFE2':
        case 'FFD8FFE3':
        case 'FFD8FFE8':
          resolve(file)
          break
        default:
          reject('Error checking mime type')
      }
    }

    reader.readAsArrayBuffer(file.slice(0, 4))
  })
}
