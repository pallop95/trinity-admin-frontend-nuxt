import { SensorModel } from "./sensorModel.interface";

export interface SensorType {
    id: string,
    address: string,
    type: string,
    sensor_models: SensorModel[],
    created_at: Date,
    updated_at: Date
}

// export interface SensorTypeDropdownList {
//     text: string,
//     value: string
// }
