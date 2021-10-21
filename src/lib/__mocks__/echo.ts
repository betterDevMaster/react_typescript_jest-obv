export const createPrivate = jest.fn(() => {
  const channel: any = {
    private: jest.fn(() => channel),
    leave: jest.fn(),
    error: jest.fn(() => channel),
    listen: jest.fn(() => channel),
    stopListening: jest.fn(),
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
        socket_id: '12345.67',
      },
    },
  }

  return channel
})
