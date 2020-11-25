import {isProduction} from '../../App'
import {api, publicAsset} from 'lib/url'

export const waiverLogoPath = (logo: string) => {
  if (!isProduction) {
    return api(`/storage/event/waiver/logos/${logo}`)
  }

  return publicAsset(`/event/waiver/logos/${logo}`)
}
