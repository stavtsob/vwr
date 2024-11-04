import { ref, Ref } from "vue"
import VWROptions from "./VWROptions"

export default class VWR<T> {
    Data: Ref<T | undefined>
    Fetcher: Function
    Loading: Ref<boolean>
    Error: Ref<any>
    Options?: VWROptions

    constructor(fetcher: Function, options: VWROptions = {}) {
        this.Fetcher = fetcher;
        this.Options = options;
        this.Loading = ref(false);
        this.Error = ref(null);
        this.Data = ref<T>();

        this.revalidate();
        // If there is an option for periodic revalidation
        if(this.Options.RevalidateInterval) {
            setInterval(async () => {
                await this.revalidate();
            }, this.Options.RevalidateInterval);
        }
    }
    revalidate = async () => {
        this.Loading.value = true;
        try {
            const results = await this.Fetcher();
            this.Data.value = results;
            this.Error.value = null;
        } catch(err) {
            this.Error.value = err;
            // If there is an option for callback on error
            if(this.Options?.ErrorCallback) {
                this.Options.ErrorCallback(err);
            }
        }
        this.Loading.value = false;
    }
}