import { ref } from "vue";
import VWR from './classes/VWR'
import VWROptions from "./classes/VWROptions";
import type VWROutput from "./classes/VWROutput";

const vwrMemory = ref<Record<string, VWR<any>>>({});

const reuseVWR = <T>(key: string, fetcher: Function, options: VWROptions = {}): VWROutput<T> => {
    const oldVwr = vwrMemory.value[key] as VWR<T>;
    const vwr = new VWR<T>(fetcher, options);
    vwr.Data.value = oldVwr.rawData;
    vwr.rawData = oldVwr.rawData;
    vwrMemory.value[key] = vwr;
    oldVwr.destroy();
    vwr.revalidate();
    vwr.triggerRevalidateCallback(vwr.rawData);
    
    return {
        data:  vwr.Data,
        error: vwr.Error,
        isLoading: vwr.Loading,
        revalidate: vwr.revalidate
    }
}
const initVWR = <T>(key: string, fetcher: Function, options: VWROptions = {}): VWROutput<T> => {
    const vwr = new VWR<T>(fetcher, options);
    vwr.revalidate();
    vwr.triggerRevalidateCallback(vwr.rawData);
    vwrMemory.value[key] = vwr;
    return {
        data:  vwr.Data,
        error: vwr.Error,
        isLoading: vwr.Loading,
        revalidate: vwr.revalidate
    }
}

const vwrExists = (key: string) => {
    return vwrMemory.value[key] != undefined;
}

const useVWR = <T>(key: string, fetcher: Function, options: VWROptions = {}): VWROutput<T> => {
    if (vwrExists(key)) {
        return reuseVWR<T>(key, fetcher, options);
    }
    return initVWR<T>(key, fetcher, options);
}

export {useVWR};
