import { BusinessUnit } from "@/interfaces/businessUnit.interface"

export const state = () => ({
  businessUnit: {} as BusinessUnit,
  businessUnitList: {} as BusinessUnit[]
})

export const mutations = {
  setBusinessUnit (state: any, businessUnit: BusinessUnit) {
    console.log('mutation: setBusinessUnit')
    state.businessUnit = businessUnit
  },
  setBusinessUnitList (state: any, businessUnitList: BusinessUnit[]) {
    console.log('mutation: setBusinessUnitList')
    state.businessUnitList = businessUnitList
  }
}

export const actions = {
  setBusinessUnitAction (vuexContext: any, businessUnit: BusinessUnit) {
    console.log('action: setBusinessUnitAction')
    vuexContext.commit('setBusinessUnit', businessUnit)
  },
  async setBusinessUnitListAction (vuexContext: any): Promise<void> {
    const res = await (this as any).$axios.get("/businessUnits.json")

    let businessUnitList = []
    for (const key in res.data) {
      businessUnitList.push({ ...res.data[key], id: key })
    }

    vuexContext.commit('setBusinessUnitList', businessUnitList)
  }
}

export const getters = {
  getBusinessUnit (state: any) {
    console.log('getters: getBusinessUnit')
    return state.businessUnit
  },
  getBusinessUnitList (state: any) {
    console.log('getters: getBusinessUnitList')
    return state.businessUnitList
  }
}
