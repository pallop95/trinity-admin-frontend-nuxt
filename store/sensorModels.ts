import { SensorModel } from "@/interfaces/sensorModel.interface"

export const state = () => ({
  sensorModel: {} as SensorModel,
  sensorModels: {} as SensorModel[]
})

export const mutations = {
  setSensorModel (state: any, sensorModel: SensorModel) {
    state.sensorModel = sensorModel
  },
  setSensorModels (state: any, sensorModels: SensorModel[]) {
    state.sensorModels = sensorModels
  }
}

export const actions = {
  setSensorModelAction (vuexContext: any, sensorModel: SensorModel) {
    vuexContext.commit('setSensorModel', sensorModel)
  },
  async setSensorModelsAction (vuexContext: any): Promise<void> {
    const res = await (this as any).$axios.get("/device/sensorModels")

    let sensorModels = []
    for (let index in res.data.data) {
      sensorModels.push( res.data.data[index] );
    }

    vuexContext.commit('setSensorModels', sensorModels)
  }
}

export const getters = {
  getSensorModel (state: any) {
    return state.sensorModel
  },
  getSensorModels (state: any) {
    return state.sensorModels
  }
}
