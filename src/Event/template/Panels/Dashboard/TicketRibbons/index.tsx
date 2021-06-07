export const BLUE_RIBBON = 'Blue'
export const GREEN_RIBBON = 'Green'
export const YELLOW_RIBBON = 'Yellow'

type Type = typeof BLUE_RIBBON | typeof GREEN_RIBBON | typeof YELLOW_RIBBON

export interface TicketRibbon {
  type: Type
  text: string
  textColor: string
}
