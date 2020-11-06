import { Firmware } from "@/interfaces/firmware.interface"

export const state = () => ({
  /*token: null,
  username: ''*/
  firmware: {} as Firmware
})

export const mutations = {
  /*setToken (state: any, token: string) {
    state.token = token
  },
  setUsername (state: any, username: string) {
    state.username = username
  },
  clearToken (state: any) {
    state.token = null
    state.username = null
  }*/
  setFirmware (state: any, firmware: Firmware) {
    console.log('mutation setFirmware')
    state.firmware = firmware
  }
}

export const actions = {
  setFirmwareAction (vuexContext: any, firmware: Firmware) {
    console.log('action setFirmware')
    vuexContext.commit('setFirmware', firmware)
  }
  /*authenticateUser (vuexContext: any, authData: ICredentials) {
    return (this as any).$axios.$post(
      '/auth/login',
      {
        username: authData.username,
        password: authData.password
      }
    ).then((result: IServerLoginResponse) => {
      vuexContext.commit('setToken', result.access_token)
      vuexContext.commit('setUsername', result.username)
      localStorage.setItem('username', result.username)
      localStorage.setItem('token', result.access_token)
    }).catch((e: any) => console.log(e))
  },
  initAuth (vuexContext: any) {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')

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
    }
  }*/
}

export const getters = {
  /*isAuthenticated (state: any) {
    return state.token != null
  },
  username (state: any) {
    return state.username
  },
  bearerToken (state: any) {
    return 'Bearer ' + state.token
  }*/
  getFirmware (state: any) {
    return state.firmware
  }
}
