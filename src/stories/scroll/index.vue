<template>
  <Scroll :data="mockData" @load="load" class="container">
    <template v-slot="{ data }">
      <div class="item">
        <div class="cover" :style="{backgroundImage: `url(${data.cover})`}"></div>
        <p class="title">{{data.title}}</p>
      </div>
    </template>
  </Scroll>
</template>

<script>
import Scroll from "../../components/scroll";
import mockData from "./data";
import Loading from "../../components/loading";

export default {
  name: "ScrollDemo",
  components: {
    Scroll
  },
  data() {
    return {
      mockData: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      Loading.show();
      setTimeout(() => {
        let data = mockData.slice(0, 10);
        this.mockData = data;
        Loading.hide();
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/css/main.css";
.container {
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  .item {
    width: 49.5%;
    float: left;
    margin-right: 1%;
    margin-bottom: 10px;
    &:nth-child(2n) {
      margin-right: 0;
    }
    .cover {
      width: 100%;
      height: 20vh;
      background-color: #f5f5f5;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .title {
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      line-height: 16px;
      font-size: 10px;
      color: #fff;
      padding: 2px 6px;
      box-sizing: border-box;
    }
  }
}
</style>