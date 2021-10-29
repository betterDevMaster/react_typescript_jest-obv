export const formatPrice = (
  price: number,
  options: {numDecimals: number} = {numDecimals: 0},
) => {
  const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: options.numDecimals,
  })
  return formatter.format(price)
}
