import { Role } from "@/interfaces/role.interface"

export const state = () => ({
  role: {} as Role,
  roleList: {} as Role[]
})

export const mutations = {
  setRole (state: any, role: Role) {
    console.log('mutation: setRole')
    state.role = role
  },
  setRoleList (state: any, roleList: Role[]) {
    console.log('mutation: setRoleList')
    state.roleList = roleList
  }
}

export const actions = {
  setRoleAction (vuexContext: any, role: Role) {
    console.log('action: setRoleAction')
    vuexContext.commit('setRole', role)
  },
  async setRoleListAction (vuexContext: any): Promise<void> {
    const res = await (this as any).$axios.get("/roles.json")

    let roleList = []
    for (const key in res.data) {
      roleList.push({ ...res.data[key], id: key })
    }

    vuexContext.commit('setRoleList', roleList)
  }
}

export const getters = {
  getRole (state: any) {
    console.log('getters: getRole')
    return state.role
  },
  getRoleList (state: any) {
    console.log('getters: getRoleList')
    return state.roleList
  }
}
