<template>
  <div class="waterfallCont" ref="waterfallCont">
    <div
      v-for="(item, index) in renderData"
      class="list"
      :key="index"
      :style="{width: `${scale * 100}%`, height: `${item.style.height}px`, top: `${item.style.top}px`, left: `${item.style.left}px`}"
      ref="waterList"
    >
      <slot :data="item"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "WaterFall",
  props: {
    // 每次新增的数据
    data: {
      type: Array,
      default(){
        return []
      }
    },
    // 元素占比
    scale: {
      type: Number,
      default: 0.5
    },
    // 字段映射
    props: {
      type: Object,
      default(){
        return {
          src: 'src'
        }
      }
    },
    // 元素额外的高度(默认每个元素的高度为图片高度)
    extraHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      renderData: [],
      positions: [], // 此数组的长度应该为图片的列数
      loadedNum: 0,
      renderDone: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let num = parseInt(1 / this.scale);
      for (let i = 0; i < num; i++) {
        this.positions[i] = 0
      }
      window.addEventListener("scroll", () => {
        this.scrollLoad();
      });
    },
    // 滚动函数
    scrollLoad() {
      function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
          method.call(context);
        }, 500);
      }
      throttle(() => {
        if (this.isBottom() && this.renderDone) {
          this.load();
        } else {
          return false;
        }
      });
    },
    // 判断滚到底部
    isBottom() {
      let documentHeight = document.body.scrollHeight;
      let winHeight = document.documentElement.clientHeight;
      let scrollHeight =
        document.documentElement.scrollTop || document.body.scrollTop;
      return documentHeight - winHeight <= scrollHeight;
    },
    /**
     * 图片预加载
     * @param {Array} [data] 新增数据
     */
    imgPreLoad(data) {
      let _data = JSON.parse(JSON.stringify(data));
      // 兼容storyBook场景
      const winWidth = this.$refs.waterfallCont.offsetWidth > 600 ? 375 : this.$refs.waterfallCont.offsetWidth;
      const imgWidth = parseFloat(winWidth * this.scale);
      const _this = this;
      this.loadedNum = 0;
      let key = this.props.src;
      _data.forEach(item => {
        let img = new Image();
        img.src = item[key];
        this.$set(item, 'style', {});
        img.onload = function(e) {
          let scale = parseFloat(this.width / this.height);
          let height = Math.round(imgWidth / scale);
          _this.$set(item.style, 'height', height);
          _this.loadedNum++;
          if (_this.loadedNum === _data.length) {
            _this.calculationTop(_data);
          }
        }
      });
    },
    /**
     * 计算每张图片的顶部位置
     * @param {Array} [data] 新增数据
     */
    calculationTop(data) {
      const winWidth = this.$refs.waterfallCont.offsetWidth > 600 ? 375 : this.$refs.waterfallCont.offsetWidth;
      const imgWidth = winWidth * this.scale;
      const num = parseInt(1 / this.scale); // 一行可以容下的图片数量
      data.forEach((item, index) => {
        let minPosition = Math.min.apply(null, this.positions);
        let minPositionIndex = this.positions.indexOf(minPosition);
        let left = (minPositionIndex % num) * imgWidth;
        this.$set(item.style, 'left', left);
        this.$set(item.style, 'top', minPosition);
        this.positions[minPositionIndex] += item.style.height + this.extraHeight;
      });
      this.renderData.push(...data);
      this.renderDone = true;
      this.$emit('renderDone');
      this.$loadingX && this.$loadingX.hide();
    },
    // 加载更多
    load() {
      this.renderDone = false;
      this.$emit("load");
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.$nextTick().then(()=>{
          this.imgPreLoad(newVal);
        })
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.waterfallCont {
  position: relative;
  width: 100%;
  height: auto;
  .list {
    position: absolute;
    background-color: #efefef;
    transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
  }
}
</style>