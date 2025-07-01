export const SITE_CONTROLLER = { AUTH: 'auth' } as const

export const SITE_ROUTES = {
  REG: 'register',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REFRESH: 'refresh',
  PROFILE: 'profile',
  USER: ':userId'
} as const
