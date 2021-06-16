export const createPrivate = jest.fn(() => ({
  private: jest.fn(() => ({
    listen: jest.fn(),
  })),
  leave: jest.fn(),
}))
