export interface Room {
  id: number
  name: string
  is_online: boolean
  has_registration: boolean
  registration_url: string | null
  max_num_attendees: number | null
}
