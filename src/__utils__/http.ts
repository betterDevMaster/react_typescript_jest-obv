import axios from 'axios'

export const mockGet = axios.get as jest.Mock
export const mockPost = axios.post as jest.Mock
export const mockPatch = axios.patch as jest.Mock
export const mockPut = axios.put as jest.Mock
export const mockDelete = axios.delete as jest.Mock
