export const numberFormat = (num: number, multipler: number) => {
  const number = Math.round(num * multipler)
  return number
}
