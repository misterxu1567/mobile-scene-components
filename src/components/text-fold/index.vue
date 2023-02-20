<template>
  <div class="text-fold">
    <div class="text-container" :style="style">
      <p class="text" ref="text"><slot></slot></p>
    </div>
    <button class="btn" v-if="needMore" @click="open">{{this.status ? '更多' : '收起'}}</button>
  </div>
</template>

<script>
export default {
  name: "TextFold",
  props: {
    lineHeight: {
      type: Number,
      default: 20
    },
    line: {
      type: [Number, String],
      default: 8
    }
  },
  data() {
    return {
      needMore: false,
      status: true,
      maxHeight: null
    };
  },
  computed: {
    style() {
      return {
        "line-height": this.lineHeight + 'px',
        "max-height": this.maxHeight
      };
    }
  },
  mounted() {
    this.isMore();
  },
  methods: {
    /**
     * 当前是否需要展开
     * true: 需要 
     */
    isMore() {
      let maxHeight = this.lineHeight * this.line;
      let height = this.$refs.text.clientHeight;
      this.status = height > maxHeight;
      this.needMore = height > maxHeight;
      this.maxHeight = this.lineHeight * this.line + 'px';
    },
    open() {
      this.status = !this.status;
      this.maxHeight = this.status ? this.lineHeight * this.line + 'px' : '10000px';
    }
  }
};
</script>
<style lang="scss" scoped>
.text-fold {
  .text-container {
    overflow: hidden;
    text-overflow: ellipsis;
    .text{
      word-break: break-all;
      white-space: pre-wrap;
    }
  }
  .btn {
    cursor: pointer;
    color: #268DFF;
    background: none;
    text-align: center;
    line-height: 34px;
  }
}
</style>