// import axois from 'axios'
import { SensorType } from "@/interfaces/sensorType.interface"

export const state = () => ({
  sensorType: {} as SensorType,
  sensorTypeList: {} as SensorType[]
})

export const mutations = {
  setSensorType (state: any, sensorType: SensorType) {
    console.log('mutation: setSensorType')
    state.sensorType = sensorType
  },
  setSensorTypeList (state: any, sensorTypeList: SensorType[]) {
    console.log('mutation: setSensorTypeList')
    state.sensorTypeList = sensorTypeList
  }
}

export const actions = {
  setSensorTypeAction (vuexContext: any, sensorType: SensorType) {
    console.log('action: setSensorTypeAction')
    vuexContext.commit('setSensorType', sensorType)
  },
  async setSensorTypeListAction (vuexContext: any): Promise<void> {
    const res = await (this as any).$axios.get("/sensorTypes.json")

    let sensorTypeList = []
      // this.sensorTypeDropdownList.push({ text: 'Select One (Optional)', value: null })
    for (const key in res.data) {
      sensorTypeList.push({ ...res.data[key], id: key })
    }

    vuexContext.commit('setSensorTypeList', sensorTypeList)
  }
}

export const getters = {
  getSensorType (state: any) {
    console.log('getters: getSensorType')
    return state.sensorType
  },

  getSensorTypeList (state: any) {
    console.log('getters: getSensorTypeList')
    return state.sensorTypeList
  }
}
