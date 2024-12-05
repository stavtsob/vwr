import { ref, type Ref } from "vue"
import VWROptions from "./VWROptions"

export default class VWR<T> {
    Data: Ref<T | undefined> // Keeps the fetched data
    rawData: T|undefined // Keeps the fetched data for copying to new VWR
    Fetcher: Function // Fetches the data
    Loading = ref(false) // Indicates the status of VWR
    Error: Ref<any> // Indicates if the VWR got an error
    Options?: VWROptions // VWR Options
    timerID: number

    constructor(fetcher: Function, options: VWROptions = {}) {
        this.Fetcher = fetcher;
        this.Options = options;
        this.Error = ref(null);
        this.Data = ref<T>();
        this.timerID = -1;
        this.Loading = ref(false);
        // If there is an option for periodic revalidation
        if(this.Options.RevalidateInterval) {
            this.timerID = setInterval(async () => {
                await this.revalidate();
            }, this.Options.RevalidateInterval);
        }
    }
    
    revalidate = async () => {
        this.Loading.value = true;
        try {
            const results = await this.Fetcher();
            this.Data.value = results;
            this.rawData = results;
            this.Error.value = null;
            // If there is an option for callback on revalidate
            this.triggerRevalidateCallback(results);
        } catch(err) {
            this.Error.value = err;
            // If there is an option for callback on error
            this.triggerErrorCallback(err);
        }
        this.Loading.value = false;
    }

    triggerRevalidateCallback = (data: any) => {
        if(!this.Options) return
        if(this.Options?.RevalidateCallback) {
            this.Options.RevalidateCallback(data);
        }
    }

    triggerErrorCallback = (error: any) => {
        if(!this.Options) return
        if(this.Options?.ErrorCallback) {
            this.Options.ErrorCallback(error);
        }
    }

    destroy = () => {
        clearInterval(this.timerID);
    }
}
