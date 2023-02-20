<template>
  <Upload :data="mockData" @done="upload" @remove="remove" />
</template>

<script>
import Upload from "../../components/upload";
import mockData from './data';
import Loading from '../../components/loading';
import Notify from '../../components/notify';

export default {
  name: "UploadDemo",
  components: {
    Upload
  },
  data() {
    return {
      mockData
    };
  },
  methods: {
    upload(fileData) {
      console.log(fileData);
      Loading.show();
      setTimeout(()=>{
        Loading.hide();
        Notify({text: '模拟-上传完成', type: 'spread'});
      }, 2000);
    },
    remove() {
        Notify({text: '模拟-删除完成', type: 'spread'});
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