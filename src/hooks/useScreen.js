import {
    ref
} from "vue"


export function useScreen(dom) {
    const width = ref(dom.clientWidth)
    const height = ref(dom.clientHeight)

    return {
        width,
        height
    }
}