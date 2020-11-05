<template>
    <div
        ref="container"
        class="screen-container"
    >
        <template v-if="ready">
            <slot></slot>
        </template>
    </div>
</template>
<script>
import { onMounted, onUnmounted, ref } from "vue";
import { debounce } from "../../utils";
export default {
  name: "ScreenContainer",
  props: {
    options: {
      type: Object,
      require: true,
    },
  },
  setup(prop) {
    const container = ref(null);
    // ready 计算完成后在进行显示
    const ready = ref(false);
    const width = ref(0);
    const height = ref(0);
    // 原始大小
    const originalWidth = ref(0);
    const originalHeight = ref(0);
    let observer = null;
    // 要注意的是clientHeight和clientWidth 如果元素是按照百分比的话 那么在浏览器缩放的时候会变化
    // 如果是指定了宽高，那么就不会变化
    // 以及如果是脱离了普通文档流那么也不会随着变化

    const init = () => {
      if (prop.options?.width || prop.options?.height) {
        width.value = prop.options.width;
        height.value = prop.options.height;
      } else {
        width.value = container.value.clientWidth;
        height.value = container.value.clientHeight;
      }
      if (!originalWidth.value || !originalHeight.value) {
        originalWidth.value = screen.width;
        originalHeight.value = screen.height;
      }
    };
    // 更新dom的宽高 （要么用户传入的 要么默认是当前屏幕尺寸）
    const updateSize = () => {
      // 一旦给DOM绑定了width和height值后 缩放浏览器宽高就不会进行变化 更新大屏实际宽高
      if (width.value && height.value) {
        // 其实一定是会存在的
        container.value.style.width = `${width.value}px`;
        container.value.style.height = `${height.value}px`;
      } else {
        container.value.style.width = `${originalWidth.value}px`;
        container.value.style.height = `${originalHeight.value}px`;
      }
    };
    // 进行当前视口区域进行缩放 让当前container进行缩放以达到充满屏幕
    const updateScale = () => {
      const currentWidth = document.body.clientWidth;
      const currentHeight = document.body.clientHeight;
      //   获取实际用户传入(不传默认浏览器window.screen宽高)
      const realWidth = width.value || originalWidth.value;
      const realHeight = height.value || originalHeight.value;
      //   计算缩放比
      const widthScale = currentWidth / realWidth;
      const heightScale = currentHeight / realHeight;
      container.value.style.transform = `scale(${widthScale},${heightScale})`;
    };
    const initSize = () => {
      updateScale();
    };
    // 监听Dom变化
    // 这里是为了当DOM变化的时候(主要是宽高属性变化)那么我需要重新初始化
    const initObserver = () => {
      const MutationObserver = window.MutationObserver;
      observer = new MutationObserver((e) => {
        init(); // 重新更新DOM (当改变尺寸的时候)
        updateScale();
      });
      observer.observe(container.value, {
        attributes: true, // 监听属性
        attributeFilter: ["style"], // 过滤指定监听的属性
        attributeOldValue: true, // 可以拿到oldValue
      });
    };
    const removeOberver = () => {
      observer.disconnect();
      observer.takeRecords();
      observer = null;
    };
    onMounted(() => {
      ready.value = false;
      init();
      updateSize();
      updateScale();
      initObserver();
      window.addEventListener("resize", debounce(50, initSize));
      ready.value = true;
    });
    onUnmounted(() => {
      window.removeEventListener("resize", initSize);
    });
    return {
      container,
      ready,
    };
  },
};
</script>
<style lang="scss" scoped>
.screen-container {
  //   height: 100%;
  overflow: hidden;
  //   postion:fixed 解决外层flex bug 固定定位会使得弹性布局失效
  //   我觉得是因为 外层flex后 元素的实际宽度无效
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  transform-origin: left top;
}
</style>