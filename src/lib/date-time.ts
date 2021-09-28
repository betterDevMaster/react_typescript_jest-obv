import moment, {unitOfTime} from 'moment-timezone'

// Moment locales
import 'moment/locale/es' // Spanish
import 'moment/locale/es-mx'
import 'moment/locale/es-us'
import 'moment/locale/es-do'
import 'moment/locale/pt' // Portuguese
import 'moment/locale/pt-br' // Brazil
import 'moment/locale/fr' // France
import 'moment/locale/en-au' // English
import 'moment/locale/en-ca'
import 'moment/locale/en-gb'
import 'moment/locale/en-nz'
import 'moment/locale/de' // Germany
import 'moment/locale/de-at'
import 'moment/locale/de-ch'
import 'moment/locale/da' // Denmark
import 'moment/locale/sv' // Sweden
import 'moment/locale/nb' // Norway
import 'moment/locale/it' // Italy
import 'moment/locale/hu' // Hungary
import 'moment/locale/ru' // Russia
import 'moment/locale/ja' // Japan
import 'moment/locale/th'
import 'moment/locale/zh-cn' // Chinese
import 'moment/locale/zh-hk'
import 'moment/locale/zh-mo'
import 'moment/locale/zh-tw'
import 'moment/locale/is' // Iceland
import 'moment/locale/fi' // Finland

export const localTime = (date: string) =>
  moment(date).tz(moment.tz.guess()).format('MMMM Do h:mma z')

export const now = () => {
  return new Date().toISOString()
}

export const time = () => formatDate(now(), 'HH:mm')

export const today = () => formatDate(now())

export const formatDate = (value: string, format = 'DD-MM-YYYY') =>
  moment(value).format(format)

export const MINUTE_PRECISION_FORMAT = 'YYYY-MM-DDTHH:mm'

export const getDiffDatetime = (
  d1: string,
  d2: string,
  resultType: unitOfTime.Diff = 's',
) => {
  var date1 = moment(d1)
  var date2 = moment(d2)
  var diff = date1.diff(date2, resultType)
  return diff
}

/**
 * Date comparison utils
 *
 * @param target
 * @returns
 */
export const date = (target: string) => {
  return {
    isAfter: (value: string) => {
      /**
       * Handle bug where sometimes moment.isAfter would return true
       * for the same string
       */
      if (target === value) {
        return false
      }

      return moment(target).isAfter(moment(value))
    },
  }
}

export const duration = (start: string, end: string) => {
  const diff = moment(end).diff(moment(start))
  return moment.utc(diff).format('HH:mm:ss')
}
