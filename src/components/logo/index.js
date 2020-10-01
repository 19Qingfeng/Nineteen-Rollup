import logo from "./index.vue"


export default function install(Vue) {
    Vue.component(logo.name, logo)
}