import { Firmware } from "@/interfaces/firmware.interface"

export const state = () => ({
  /*token: null,
  username: ''*/
  firmware: {} as Firmware
})

export const mutations = {
  setFirmware (state: any, firmware: Firmware) {
    console.log('mutation: setFirmware')
    state.firmware = firmware
  }
}

export const actions = {
  setFirmwareAction (vuexContext: any, firmware: Firmware) {
    console.log('action: setFirmwareAction')
    vuexContext.commit('setFirmware', firmware)
  }
}

export const getters = {
  getFirmware (state: any) {
    console.log('getter: getFirmware')
    return state.firmware
  }
}
