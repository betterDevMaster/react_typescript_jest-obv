const router = jest.requireActual('react-router-dom')
module.exports = {
  ...router,
  useLocation: jest.fn(() => ({
    search: '',
    pathname: '',
  })),
  useParams: jest.fn(() => router.useParams()), // Still use actual implementation if we're not mocking
}
