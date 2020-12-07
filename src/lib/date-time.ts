import moment from 'moment-timezone'

export const blogPostTime = (date: string, timezone: string) =>
  moment(date).tz(moment.tz.guess()).format('MMMM Do h:mma z')

export const now = () => new Date().toISOString()
