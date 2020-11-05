<template>
    <div
        class="base-scroll-list"
        ref="container"
    >
        <div
            class="base-scroll-header"
            :style="{'background-color':actualConfig.headerBg,'height':`${+actualConfig.headerHeight}px`,
            fontSize:`${actualConfig.headerFontSize}px`,
            color:actualConfig.headerColor}"
        >
            <div
                class="header-item text"
                v-for="(headerItem,index) in headerData"
                :key="index"
                :align="actualConfig.headerAlign"
                :style="{width:`${headerWidth[index]}px`,...headerStyle[index]}"
                v-html="headerItem"
            />
        </div>
        <div
            class="base-scroll-rows-wapper"
            :style="{height:`${wholeHeight - actualConfig.headerHeight}px`}"
        >
            <!-- 注意这里div的key 要求每次数据更新之后就重新渲染 -->
            <!-- 如果使用rowIndex的话diff算法就会复用之前div 第一个高度就会从0变成72 -->
            <!-- 使用不同的key直接渲染之前的div 那么就会进行transition变化 -->
            <!-- 而使用不同的key值时 就会直接重新渲染不同的div 所以从0-72高度的变化过程就不会进行transition -->
            <div
                class="base-scroll-rows"
                v-for="(rowData,rowIndex) in currentRowData"
                :key="rowData.index"
                :style="{backgroundColor:rowBgColor(rowData.index),
                fontSize:`${actualConfig.rowFontSize}px`,
                height:`${rowsHeight[rowIndex]}px`,
                lineHeight:`${rowsHeight[rowIndex]}px`,
                color:actualConfig.rowColor}"
            >
                <!-- 注意style绑定的是对象，所以这里使用了对象的扩展运算符合并 -->
                <div
                    class="base-scroll-list-column"
                    v-for="(colData,colIndex) in rowData.value"
                    :style="{width:`${headerWidth[colIndex]}px`,...rowStyle[colIndex]}"
                    :key="colIndex"
                    :align="actualConfig.rowsAlign"
                    v-html="colData"
                >
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { ref, onMounted, nextTick, watch } from "vue";
import cloneDeep from "lodash/cloneDeep";
import assign from "lodash/assign";
import { useScreen } from "../../hooks/useScreen";
const defaultConfig = {
  headerData: [],
  headerStyle: [],
  headerBg: "rgb(90,90,90)",
  headerHeight: 48,
  headerIndex: false,
  headerIndexContext: "#",
  headerIndexData: [],
  headerAlign: "center",
  headerFontSize: 32,
  headerColor: "#fff",
  headerIndexContextStyle: {},
  data: [],
  rowNumber: 10, // 每页显示行数
  // 序号列内容的样式
  rowIndexStyle: {
    color: "red",
  },
  // 表体样式
  rowStyle: [],
  // 奇偶行背景颜色
  rowBg: ["rgb(40,40,40)", "rgb(55,55,55)"],
  rowFontSize: 28,
  rowColor: "#fff",
  rowsAlign: "center",
  moveItems: 1,
  duration: 2,
};
export default {
  name: "BaseScrollList",
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const container = ref(null);
    const actualConfig = ref({});

    const headerData = ref([]);
    const headerStyle = ref([]);
    const headerWidth = ref([]);

    const rowStyle = ref([]);
    const rowsData = ref([]); // 总的
    const currentRowData = ref([]); // 当前展示
    const currentIndex = ref(0);
    const rowItemHeight = ref(0); // 每行行高
    const rowsHeight = ref([]); // 数组 行高
    const wholeHeight = ref(0);
    let stopAnimation = false;

    // 处理props Header逻辑
    const handleConfigHeader = (config) => {
      const _headerData = cloneDeep(config.headerData);
      const _headerStyle = cloneDeep(config.headerStyle);
      const _rowStyle = cloneDeep(config.rowStyle);
      if (!_headerData?.length) return;
      if (config.headerIndex) {
        _headerData.unshift(config.headerIndexContext);
        _headerStyle.unshift(config.headerIndexContextStyle);
        _rowStyle.unshift(config.rowIndexStyle);
      }
      headerData.value = _headerData;
      headerStyle.value = _headerStyle;
      rowStyle.value = _rowStyle;
      const { width, height } = useScreen(container.value);
      computedHeaderArea(width, height);
    };

    // 处理props Data逻辑
    const handleConfigData = (config) => {
      rowsData.value = config.data || [];
      if (config.headerIndex) {
        // 处理序号列
        rowsData.value.forEach((item, index) => {
          if (
            config.headerIndexData &&
            config.headerIndexData.length > 0 &&
            config.headerIndexData[index]
          ) {
            // debugger;
            item.unshift(config.headerIndexData[index]);
          } else {
            item.unshift(index + 1);
          }
        });
      }
      // 计算高度
      computedHeight(config);
    };

    // 奇偶列背景颜色
    const rowBgColor = (index) => {
      const bgColor =
        index % 2 === 0
          ? actualConfig.value.rowBg[0]
          : actualConfig.value.rowBg[1];
      return bgColor;
    };

    // 计算表体高度
    const computedHeight = (config) => {
      const { width, height } = useScreen(container.value);
      const { headerHeight, rowNumber } = config;
      const unUsedHeight = height.value - headerHeight;
      // rowHeight.value = Math.floor(unUsedHeight / rowNumber);
      // 可删除变量 rowHeight
      const rowHeight = Math.floor(unUsedHeight / rowNumber);
      rowItemHeight.value = rowHeight;
      rowsHeight.value = new Array(rowsData.value.length).fill(rowHeight);
    };

    // 计算表头宽度/高度
    const computedHeaderArea = (width, height) => {
      let useWidth = 0;
      let useCount = 0;
      const length = headerData.value.length;
      const _headerStyle = headerStyle.value;
      // 查找是否存在自定义width
      _headerStyle.forEach((style) => {
        // 存在 按照自定义width判断
        if (style.width) {
          // 计算自定义宽度总数和总个数
          useWidth = +style.width.replace("px", "");
          useCount++;
        }
      });
      // 动态计算列宽时 使用剩余的宽度除以剩余列数
      const _widthCount = Math.floor(
        (width.value - useWidth) / (length - useCount)
      );
      const arrayWidth = new Array(length).fill(_widthCount);
      // 计算结果后再次循环 替换arrayWidth
      _headerStyle.forEach((style, index) => {
        // 存在 按照自定义width判断
        if (style.width) {
          // 替换对应宽度
          arrayWidth[index] = +style.width.replace("px", "");
        }
      });
      headerWidth.value = arrayWidth;
    };
    // 初始化整体数据 需要做额外兼容处理
    const initRowData = (rowNumber, data) => {
      const length = data.length;
      if (!length) return [];
      if (length > rowNumber) {
        return data.map((i, idx) => {
          return {
            value: i,
            index: idx,
          };
        });
      }
      if (length * 2 > rowNumber) {
        const newData = [...cloneDeep(data), ...cloneDeep(data)];
        return newData.map((i, idx) => {
          return {
            value: i,
            index: idx,
          };
        });
      }
    };
    // 经典基础算法 滚动算法
    const startAnmiation = async () => {
      // return;
      if (stopAnimation) {
        nextTick(() => {
          update();
        });
        return;
      }
      const { rowNumber, moveItems, duration } = actualConfig.value;

      const _rowData = initRowData(rowNumber, rowsData.value);
      const length = _rowData.length;

      if (length < rowNumber) {
        currentRowData.value = _rowData;
      } else {
        // 开启动画
        const data = _rowData.slice(currentIndex.value);
        data.push(..._rowData.slice(0, currentIndex.value));
        currentRowData.value = data;
        // 第一次渲染出来之后 我先让先头的个数 高度为0 消失 然后在进行重新渲染(这个时候用户无法察觉变化)
        // 视觉上就是动画元素往上移动了
        rowsHeight.value = new Array(length).fill(rowItemHeight.value);
        // 先重新渲染 0.3s 后 进行动画展示
        // 这个Promise 更新页面
        await new Promise((res) => setTimeout(res, 300));
        if (stopAnimation) {
          nextTick(() => {
            update();
          });
          return;
        }

        // 使用nextTick的话 第一次页面渲染之后 直接就将height变为了0
        // await nextTick(); // 为什么这里不可以？
        // 页面已经更新了 开始进行动画
        rowsHeight.value.splice(0, moveItems, ...new Array(moveItems).fill(0));
        // 动画 0.3s后结束 等待1s后 更改currentIndex的值 其实也就是延迟渲染 不然就会立马渲染
        await new Promise((res) => setTimeout(res, duration * 1000));
        if (stopAnimation) {
          nextTick(() => {
            update();
          });
          return;
        }

        currentIndex.value += moveItems;
        const lasted = currentIndex.value - length;
        if (lasted >= 0) {
          currentIndex.value = lasted;
        }
        await startAnmiation();
      }
    };

    const update = async () => {
      // 关闭动画
      // 关闭动画
      const _config = assign(defaultConfig, props.config);
      // 拿到总高度
      const { height } = useScreen(container.value);
      wholeHeight.value = height.value;
      handleConfigHeader(_config);
      handleConfigData(_config);
      actualConfig.value = _config;
      // 开启动画
      stopAnimation = false;
      startAnmiation();
    };

    // 判断上一步是否执行动画
    const judeAnimation = (config) => {
      const { rowNumber, moveItems, duration } = config;
      const _rowData = initRowData(rowNumber, rowsData.value);
      const length = _rowData.length;
      return length < rowNumber;
    };

    watch(
      () => props.config,
      (cur, pre) => {
        if (!pre.value) pre = defaultConfig;
        if (judeAnimation(pre)) {
          // 上一步如果没有执行动画
          update();
        } else {
          // 上一步已经在执行动画了 那么就停止动画
          stopAnimation = true;
        }
      }
    );

    onMounted(() => {
      update();
    });

    return {
      container,
      headerData,
      headerStyle,
      actualConfig,
      headerWidth,
      rowsData,
      currentRowData,
      rowsHeight,
      rowStyle,
      rowBgColor,
      wholeHeight,
    };
  },
};
</script>
<style lang="scss" scoped>
.base-scroll-list {
  height: 100%;
  width: 100%;
}
.base-scroll-header {
  display: flex;
  align-items: center;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-item {
    padding: 0 10px;
    box-sizing: border-box;
  }
}
.base-scroll-rows-wapper {
  overflow: hidden;
  .base-scroll-rows {
    overflow: hidden;
    transition: all 0.3s linear;
    display: flex;
    .base-scroll-list-column {
      width: 100%;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>