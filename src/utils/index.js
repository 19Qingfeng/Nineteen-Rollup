export function debounce(deley, callback) {
    let task;
    return function () {
        clearTimeout(task)
        task = setTimeout(() => {
            callback.apply(this, arguments)
        }, deley)
    }
}