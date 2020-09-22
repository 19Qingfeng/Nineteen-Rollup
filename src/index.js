import Test from "./test.vue"
import SvgWapper from "./components/svg-wapper.vue"
import Icon from "./components/Icon.vue"
import Process from "./components/process.vue"
import Path from "./components/path.vue"


export default function(Vue) {
    Vue.component(Test.name, Test)
    Vue.component(Path.name, Path)
    Vue.component(Icon.name, Icon)
    Vue.component(SvgWapper.name, SvgWapper)
    Vue.component(Process.name, Process)
}