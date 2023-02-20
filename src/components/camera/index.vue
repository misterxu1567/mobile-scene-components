<template>
  <div class="photograph">
    <div class="container">
      <video id="video" class="video" width="320" autoplay="autoplay"></video>
      <div
        :style="{backgroundImage: `url(${image})`}"
        class="headImage"
        v-if="image"
        v-show="!cameraStatus"
      ></div>
      <!-- 图片获取状态 -->
      <div class="photoViewStatus" v-show="photoAlertStatus || statusInfo.status !== ''">
        <div class="loading">
          <img src="./img/loading.png" class="loader" v-show="statusInfo.status === 'loading'" />
          <img src="./img/failIco.png" class="loaderNoAni" v-show="statusInfo.status === 'fail'" />
        </div>
        <p>{{statusInfo.text}}</p>
      </div>
    </div>
    <div class="btnBox">
      <button class="btn" v-if="!cameraStatus" @click="connectCamera">拍照</button>
      <button class="btn" v-else @click="takePhoto">确认</button>
    </div>
  </div>
</template>

<script>
import Lib from "../../lib";
import Notify from '../notify';
const { convertBase64UrlToBlob, judgeBrowser } = Lib;

export default {
  name: "Camera",
  props: {
    image: {
      type: String,
      default: ""
    },
    statusInfo: {
      type: Object,
      default: {
        status: "", // loading | fail
        text: ""
      }
    }
  },
  data() {
    return {
      cameraStatus: false, // 拍照状态， true => 开启；false => 关闭
      photoAlertStatus: false, // 图像提示文案显示状态 true => 显示；false => 隐藏
    };
  },
  methods: {
    // 连接摄像头
    connectCamera() {
      const video = document.getElementById("video");
      this.photoAlertStatus = false;
      // 区域控制
      let obj = {};
      if (this.systemCameraVideo()) {
        obj = { width: 320, height: 320 };
      } else {
        obj = { width: 320 };
      }
      let constraints = {
        video: obj,
        audio: false
      };
      // 当前在IE浏览器无法调用摄像头
      try {
        let Promise = navigator.mediaDevices.getUserMedia(constraints);
        Promise.then(MediaStream => {
          video.srcObject = MediaStream;
          window.MediaStreamTrack = MediaStream.getTracks()[0]; // 摄像头对象
          video.play();
          this.cameraStatus = true;
        });
      } catch (err) {
        Notify("浏览器不支持调用摄像头，请更换最新的谷歌浏览器，或者其他最新版");
      }
    },
    // 绘制照片
    takePhoto() {
      let base64 = this.getBase64();
      let formData = this.base64ToFormData(base64);
      this.$emit("change", { formData, base64 });
      // 关闭摄像头
      this.cameraStatus = false;
      window.MediaStreamTrack &&
        window.MediaStreamTrack.stop &&
        window.MediaStreamTrack.stop();
    },
    /**
     * 获取video中的图片信息
     * @return { Object } (base64)
     */
    getBase64() {
      let video = document.getElementById("video");
      let canvas = document.createElement("canvas");
      canvas.width = canvas.height = 320;
      let ctx = canvas.getContext("2d");
      let w = video.offsetWidth;
      let h = video.offsetHeight;
      let y = (canvas.width - h) / 2;
      // 区域控制
      if (this.systemCameraVideo()) {
        y = 0;
      }
      // end
      ctx.drawImage(video, 0, y, w, h);
      let base64 = canvas.toDataURL("image/jpeg", 0.4);
      return base64;
    },
    /**
     * base64 => FormData
     * @param { Object } [base64]
     * @return { Object } (FormData)
     */
    base64ToFormData(base64) {
      let Blob = convertBase64UrlToBlob(base64);
      let formData = new FormData();
      formData.append("file", Blob);
      return formData;
    },
    /**
     * 浏览器判断
     * 说明: 浏览器类型/版本(控制摄像头video区域大小)，在部分浏览器获取的摄像头拍照区域为长方形，所以需要判断浏览器，当前低版本的 safari 和 uc 会是长方形区域
     */
    systemCameraVideo() {
      const system = judgeBrowser();
      let version = parseInt(system.version.replace(/\./g, ""));
      return system.browser === "chrome" ||
        (system.browser === "safari" && version >= 1211);
    }
  }
};
</script>

<style lang="scss" scoped>
.photograph {
  display: block;
  width: 320px;
  height: 320px;
  margin: 0 auto;
  .container {
    display: block;
    width: 320px;
    height: 320px;
    background: #eee;
    background-size: 56px auto;
    position: relative;
  }
}

.btnBox {
  margin-top: 24px;
  display: block;
  text-align: center;
  .btn {
    display: inline-block;
    width: 120px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    color: #b5975e;
    margin: 0 12px;
    border: 1px solid #b5975e;
    transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    -ms-transition: all 0.5s ease;
    position: relative;
    z-index: 9;
    &:hover {
      opacity: 0.8;
    }
    &[disabled] {
      border-color: #b6b6b6;
      color: #b6b6b6;
      cursor: not-allowed;
    }
  }
}
.video {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
}

.headImage {
  display: block;
  width: 320px;
  height: 320px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: absolute;
}
.photoViewStatus {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #646464;
  color: #fff;
  text-align: center;
  padding-top: 200px;
  box-sizing: border-box;
  /* loading 动画 */
  .loading {
    .loaderNoAni {
      display: block;
      width: 54px;
      height: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -27px 0 0 -27px;
    }
    .loader {
      display: block;
      width: 54px;
      height: auto;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -27px 0 0 -27px;
      transform-origin: 50% 50%;
      animation: rotateAni 1s infinite linear;
    }
  }
}
@keyframes rotateAni {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>