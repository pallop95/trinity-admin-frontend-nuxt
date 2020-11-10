import { SensorModel } from "./sensorModel.interface";

export interface SensorType {
    id: string,
    address: string,
    typeName: string,
    sensorModel: SensorModel,
    created_at: Date
}

// export interface SensorTypeDropdownList {
//     text: string,
//     value: string
// }
