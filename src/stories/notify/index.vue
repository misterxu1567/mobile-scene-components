<template>
  <div class="btnBox">
    <button @click="handleClick({text: '展开动画', type: 'spread'})">展开动画</button>
    <button @click="handleClick({text: '渐隐动画', type: 'fade'})">渐隐动画</button>
    <button @click="handleClick({text: '从上渐隐', type: 'upFade'})">从上渐隐</button>
  </div>
</template>

<script>
// import Vue from 'vue';
import Notify from '../../components/notify';
// Vue.use(Notify);

export default {
  name: "NotifyDemo",
  methods: {
    handleClick(config) {
      Notify(config);
      // this.$notify(config);
    }
  }
};
</script>
<style lang="scss" scoped>
.btnBox{
  >button{
    cursor: pointer;
    margin:10px;
    background: rgb(23, 123, 216);
    color:#fff;
    width: 80px;
    height: 38px;
    border-radius: 4px;
  }
}
</style>