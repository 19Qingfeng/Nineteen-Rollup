import SvgWapper from "./components/svg-wapper.vue"
import Icon from "./components/Icon.vue"
import Process from "./components/process.vue"
import Path from "./components/path.vue"

import BaseScrollList from "./components/baseScrollList"


export default function(Vue) {
    Vue.component(Path.name, Path)
    Vue.component(Icon.name, Icon)
    Vue.component(SvgWapper.name, SvgWapper)
    Vue.component(Process.name, Process)
    Vue.component(BaseScrollList.name, BaseScrollList)

}