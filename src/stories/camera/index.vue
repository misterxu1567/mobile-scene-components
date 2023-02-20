<template>
  <Camera :image="image" :statusInfo="statusInfo" @change="getPhoto" />
</template>

<script>
import Camera from "../../components/camera";

export default {
  name: "CameraDemo",
  components: {
    Camera
  },
  data() {
    return {
      image: "",
      statusInfo: {
        status: "",
        text: ""
      }
    };
  },
  methods: {
    // 获取拍照图像
    getPhoto({ formdata, base64 }) {
      // 上传中
      this.statusInfo.status = "loading";
      this.statusInfo.text = "上传中";
      // 上传失败
      // setTimeout(() => {
      //   this.statusInfo.status = "fail";
      //   this.statusInfo.text = "失败";
      // }, 2000);
      // 上传成功
      setTimeout(() => {
        this.statusInfo.status = "";
        this.statusInfo.msg = "";
        this.image = base64;
      }, 4000);
    }
  }
};
</script>