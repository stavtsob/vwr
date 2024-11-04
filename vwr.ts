import { computed, ref, type Ref } from "vue";
import VWR from './classes/VWR'
import VWROptions from "./classes/VWROptions";

const vwrMemory = ref<Record<string, VWR<any>>>({});

const reuseVWR = <T>(key: string, fetcher: Function) => {
    const vwr = vwrMemory.value[key] as VWR<T>;
    vwrMemory.value[key].Fetcher = fetcher;
    return {
        data: computed(() => vwr.Data),
        error: computed(() => vwr.Error),
        isLoading: computed(() => vwr.Loading),
        revalidate: vwr.revalidate
    }
}
const initVWR = <T>(key: string, fetcher: Function, options: VWROptions = {}) => {
    const vwr = new VWR<T>(fetcher, options);
    vwrMemory.value[key] = vwr;

    return {
        data: computed(() => vwr.Data),
        error: computed(() => vwr.Error),
        isLoading: computed(() => vwr.Loading),
        revalidate: vwr.revalidate
    }
}

const vwrExists = (key: string) => {
    return vwrMemory.value[key] != undefined;
}

const useVWR = <T>(key: string, fetcher: Function, options: VWROptions = {})  => {
    if (vwrExists(key)) {
        return reuseVWR<T>(key, fetcher);
    }
    return initVWR<T>(key, fetcher, options);
}

export {useVWR};
