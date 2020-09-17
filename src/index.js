import plugins from "./plugins/index"

import pkj from "../package.json"

console.log(pkj, 'pkj')

// TreeShaking
export default {
    a: 1,
    b: () => {
        console("1")
    }
}

console.log(plugins, 'plugin')