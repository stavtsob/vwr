import { Ref } from "vue";

export default interface VWROutput<T> {
    data: Ref<T | undefined, T | undefined>
    error: Ref<any,any>
    isLoading: Ref<boolean,boolean>
    revalidate: () => Promise<void>
}
