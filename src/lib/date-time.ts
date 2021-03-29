import moment, {unitOfTime} from 'moment-timezone'

export const blogPostTime = (date: string) =>
  moment(date).tz(moment.tz.guess()).format('MMMM Do h:mma z')

export const now = () => new Date().toISOString()

export const formatDate = (value: string, format = 'DD-MM-YYYY') =>
  moment(value).format(format)

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
