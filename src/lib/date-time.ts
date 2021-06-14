import moment, {unitOfTime} from 'moment-timezone'

export const blogPostTime = (date: string) =>
  moment(date).tz(moment.tz.guess()).format('MMMM Do h:mma z')

export const now = () => {
  return new Date().toISOString()
}

export const time = () => formatDate(now(), 'HH:mm')

export const today = () => formatDate(now())

export const formatDate = (value: string, format = 'DD-MM-YYYY') =>
  moment(value).format(format)

export const DATE_TIME_FORMAT = 'Do MMMM h:mma'

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

export const isAfter = ({isAfter, target}: {isAfter: string; target: string}) =>
  moment(target).isAfter(moment(isAfter))
