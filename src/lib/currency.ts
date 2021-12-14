export const formatPrice = (
  price: number,
  options: {numDecimals: number} = {numDecimals: 2},
) => {
  const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: options.numDecimals,
  })
  return formatter.format(price)
}
