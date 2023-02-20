<template>
  <div class="noticeBar">
    <img src="./assets/img/ico.png" class="ico">
    <div class="content" ref="contentBox">
      <div class="block" ref="blockStart"></div>
      <div class="text">{{content}}</div>
      <div class="block" ref="blockEnd"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticeBar",
  props: {
    content: {
      type: String,
      default: ''
    },
    interval: {
      type: [Number, String],
      default: 50
    }
  },
  data(){
    return {
      timer: null
    }
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
      if (this.timer) {
        this.reset();
      }
      const contentBox = this.$refs.contentBox;
      let lastScrollLeft = 0;
      this.$refs.blockStart.style.width = contentBox.offsetWidth + 'px';
      this.$refs.blockEnd.style.width = contentBox.offsetWidth + 10 + 'px';
      const scroll = () => {
        if (contentBox.scrollLeft === lastScrollLeft) {
          contentBox.scrollLeft = 0;
        } else {
          contentBox.scrollLeft += 1;
        }
        lastScrollLeft = contentBox.scrollLeft;
        contentBox.scrollLeft += 1;
      };
      this.timer = setInterval(()=>{
        scroll();
      }, this.interval);
    },
    reset(){
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  destroyed(){
    this.reset();
  }
};
</script>
<style lang="scss" scoped>
.noticeBar{
  overflow: hidden;
  line-height: 30px;
  background: #efefef;
  .ico{
    float: left;
    width: 20px;
    height: 16px;
    font-weight: bold;
    text-align: center;
    padding: 7px 8px 0 10px;
  }
  .content{
    float: left;
    width: calc(100% - 48px);
    overflow-x: scroll;
    white-space: nowrap;
    font-size: 0;
    &::-webkit-scrollbar {
      display: none;
    }
    .text{
      display: inline-block;
      font-size: 14px;
      word-break: keep-all;
      white-space: nowrap;
    }
    .block{
      display: inline-block;
      height: 100%;
    }
  }
}
</style>