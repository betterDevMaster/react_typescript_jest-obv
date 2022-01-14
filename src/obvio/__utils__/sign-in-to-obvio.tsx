import {TeamMember} from 'auth/user'
import {fakeTeamMember} from 'organization/Team/__utils__/factory'
import {setObvioAppUrl} from 'organization/__utils__/authenticate'
import {authenticate} from '__utils__/auth'
import {render} from '__utils__/render'
import App from 'App'
import React from 'react'

export type SignInToObvioOptions = {
  authUser?: TeamMember
  beforeRender?: () => void
}

export async function signInToObvio(options: SignInToObvioOptions = {}) {
  const user = options.authUser || fakeTeamMember()

  setObvioAppUrl()
  authenticate(user)

  options.beforeRender && options.beforeRender()

  return render(<App />)
}
