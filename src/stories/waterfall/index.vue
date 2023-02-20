<template>
  <WaterFall :scale="0.5" :props="props" :data="mockData" @load="load">
    <template v-slot="{ data }">
      <div>
        <img :src="data.cover" class="cover" />
        <p class="name">{{data.title}}</p>
      </div>
    </template>
  </WaterFall>
</template>

<script>
import WaterFall from "../../components/waterfall";
import mockData from './data';
import Loading from '../../components/loading';

export default {
  name: "WaterFallDemo",
  components: {
    WaterFall
  },
  data() {
    return {
      props: {
        src: 'cover'
      },
      mockData: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      Loading.show();
      this.mockData = JSON.parse(JSON.stringify(mockData.slice(0, 9)));
      setTimeout(()=>{
        Loading.hide();
      }, 2000)
    }
  }
};
</script>

<style>
@import "../assets/css/main.css";
.cover {
  display: block;
  width: 100%;
  height: auto;
}
.name {
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: auto;
  line-height: 16px;
  font-size: 10px;
  color: #fff;
  padding: 2px 6px;
  box-sizing: border-box;
}
</style>