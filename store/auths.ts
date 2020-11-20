import { ICredentials, IServerLoginResponse } from '@/interfaces/auth.interface'

export const state = () => ({
  token: null,
  username: ''
})

export const mutations = {
  setToken (state: any, token: string) {
    state.token = token
  },
  setUsername (state: any, username: string) {
    state.username = username
  },
  clearToken (state: any) {
    state.token = null
    state.username = null
  }
}

export const actions = {
  authenticateUser (vuexContext: any, authData: ICredentials) {
    return (this as any).$axios.$post(
      // '/auth/login',
      '/user/login',
      {
        username: authData.username,
        password: authData.password
        // returnSecureToken: true
      }
    ).then((res: any) => {
      const result: IServerLoginResponse = res.data;
      vuexContext.commit('setToken', result.auth_token)
      vuexContext.commit('setUsername', result.username)
      localStorage.setItem('username', result.username)
      localStorage.setItem('token', result.auth_token)
      // localStorage.setItem('tokenExpiration', new Date().getTime() + +result.expiresIn * 1000);
    }).catch((e: any) => console.log(e))

    /*{
      "access_token": "string",
      "id": 0,
      "username": "string"
    }*/
  },
  initAuth (vuexContext: any) {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    // const expirationDate = localStorage.getItem('tokenExpiration');

    // if (new Date().getTime() > +expirationDate || !token) {
    if (!token) {
      vuexContext.dispatch('logout')
      return
    }

    vuexContext.commit('setToken', token)
    vuexContext.commit('setUsername', username)
  },
  logout (vuexContext: any) {
    vuexContext.commit('clearToken')

    if (process.client) {
      localStorage.removeItem('username')
      localStorage.removeItem('token')
      // localStorage.removeItem('tokenExpiration')
    }
  }
}

export const getters = {
  isAuthenticated (state: any) {
    return state.token != null
  },
  username (state: any) {
    return state.username
  },
  bearerToken (state: any) {
    return 'Bearer ' + state.token
  }
}
