export const createPrivate = jest.fn(() => ({
  private: jest.fn(() => ({
    listen: jest.fn(() => ({
      pusher: {
        connection: {
          bind: (evt: string, cb: () => void) => {
            /**
             * Immediately call connected callback
             * to mock a socket connection
             */
            if (evt === 'connected') {
              cb()
            }
          },
        },
      },
    })),
  })),
  leave: jest.fn(),
}))
