export interface Room {
  id: number
  number: number
  description: string | null
  is_online: boolean
  has_registration: boolean
  registration_url: string | null
  max_num_attendees: number | null
}
