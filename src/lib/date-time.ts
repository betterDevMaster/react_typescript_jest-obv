import moment, {unitOfTime} from 'moment-timezone'

export const blogPostTime = (date: string) =>
  moment(date).tz(moment.tz.guess()).format('MMMM Do h:mma z')

export const now = () => {
  const date = new Date().toISOString()
  return date.split('.')[0] // without ms, and 'Z'
}

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
