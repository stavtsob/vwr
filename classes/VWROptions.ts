import { RevalidateCallback } from "./RevalidateCallback"

export default class VWROptions {
    RevalidateInterval?: number
    RevalidateCallbacks?:    RevalidateCallback[]
    ErrorCallback?: Function
}
