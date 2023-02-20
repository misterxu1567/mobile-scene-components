<template>
  <div class="btnBox">
    <button @click="handleClick">加载</button>
  </div>
</template>

<script>
// import Vue from 'vue';
import Loading from '../../components/loading';
// Vue.use(Loading);

export default {
  name: "LoadingDemo",
  methods: {
    handleClick(type) {
      Loading.show();
      // this.$loading.show();
      setTimeout(()=>{
        Loading.hide();
        // this.$loading.hide();
      }, 3000)
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