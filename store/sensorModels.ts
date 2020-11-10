import { SensorModel } from "@/interfaces/sensorModel.interface"

export const state = () => ({
  sensorModel: {} as SensorModel
})

export const mutations = {
  setSensorModel (state: any, sensorModel: SensorModel) {
    console.log('Store: mutation setSensorModel')
    state.sensorModel = sensorModel
  }
}

export const actions = {
  setSensorModelAction (vuexContext: any, sensorModel: SensorModel) {
    console.log('Store: action setSensorModelAction')
    vuexContext.commit('setSensorModel', sensorModel)
  }
}

export const getters = {
  getSensorModel (state: any) {
    console.log('Store: getters getSensorModel')
    return state.sensorModel
  }
}
