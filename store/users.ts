import { User } from "@/interfaces/user.interface"

export const state = () => ({
  user: {} as User
})

export const mutations = {
  setUser (state: any, user: User) {
    console.log('Store: mutation setUser')
    state.user = user
  }
}

export const actions = {
  setUserAction (vuexContext: any, user: User) {
    console.log('Store: action setUserAction')
    vuexContext.commit('setUser', user)
  }
}

export const getters = {
  getUser (state: any) {
    console.log('Store: getters getUser')
    return state.user
  }
}
