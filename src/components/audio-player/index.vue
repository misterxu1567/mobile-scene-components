<template>
  <div class="audioPlayer">
    <div class="audioCard">
      <button
        class="playBtn"
        :style="playBtnStyle"
        :class="{'pause': playStatus, 'loading': loading, 'cover': data.cover}"
        @click="togglePlay"
        :diasbled="!loading"
      ></button>
      <div class="info">
        <p class="tit">{{data.title}}</p>
        <div class="bomStatus">
          <div class="progress" @click="clickProgress" ref="progerssDom">
            <p class="progressBar" :style="{width: progressStr}"></p>
            <button class="dot" :style="{left: progressStr}" @touchmove="moveProgress"></button>
          </div>
        </div>
        <div class="timeCover">
          <span class="timeStatus">{{transformTime(playStatusTime)}}</span>
          <span class="timeOver">{{transformTime(duration || data.audioDuration)}}</span>
        </div>
      </div>
    </div>
    <audio :src="data.src" ref="audioDom" preload="auto" class="audio"></audio>
  </div>
</template>

<script>
import Lib from "../../lib";
const { transformTime } = Lib;

export default {
  name: "AudioPlayer",
  props: {
    data: {
      type: Object,
      required: true
    },
    theme: {
      type: String,
      default: "cover"
    }
  },
  data() {
    return {
      playStatus: false,
      progress: 0, // 播放进度 0 － 100
      duration: 0, // 总时长（秒）
      durationTime: null, // 总时长（秒）
      playStatusTime: 0, // 当前播放时间（秒）
      playEnd: false, // 播放是否结束状态
      loading: true
    };
  },
  computed: {
    progressStr() {
      return parseInt(this.progress) + "%";
    },
    playBtnStyle() {
      let style = {};
      if (this.data.cover) {
        style = {
          backgroundImage: `url('${this.data.cover}')`
        };
      }
      return style;
    }
  },
  mounted() {
    this.judegPlayStatus();
    this.getDuration();
    this.observerProgress();
  },
  methods: {
    // 重置
    reset() {
      this.playStatus = false;
      this.progress = 0;
      this.duration = 0;
      this.playStatusTime = 0;
      this.loading = false;
    },
    // 播放切换
    togglePlay() {
      this.playStatus = !this.playStatus;
      const AudioDom = this.$refs.audioDom;
      if (this.playStatus) {
        this.loading = true;
        if (this.playEnd) {
          AudioDom.currentTime = 0;
          this.observerProgress();
        }
        AudioDom.play();
      } else {
        AudioDom.pause();
      }
    },
    // 点击
    clickProgress(event) {
      let offsetX = event.offsetX;
      const progerssWidth = this.$refs.progerssDom.offsetWidth;
      this.calculation(offsetX, progerssWidth);
      // 快进
      if (this.durationTime !== null) {
        this.$refs.audioDom.currentTime =
          (offsetX / progerssWidth) * this.durationTime;
      }
    },
    // 拖动
    moveProgress(event) {
      const progerssLeft = this.$refs.progerssDom.offsetLeft;
      const progerssWidth = this.$refs.progerssDom.offsetWidth;
      let maxClientX = progerssLeft + progerssWidth;
      let clientX = event.touches[0].clientX;
      if (event.touches[0].clientX >= maxClientX) {
        clientX = maxClientX;
      }
      if (event.touches[0].clientX <= progerssLeft) {
        clientX = progerssLeft;
      }
      let currentLength = clientX - progerssLeft;
      if (clientX > maxClientX) {
        return false;
      }
      this.calculation(currentLength, progerssWidth);
      // 快进
      if (this.durationTime !== null) {
        this.$refs.audioDom.currentTime =
          (currentLength / progerssWidth) * this.durationTime;
      }
    },
    /**
     * 计算进度条
     * @param { String | Number } [current] (当前长度)
     * @param { String | Number } [total] (总长)
     */
    calculation(current, total) {
      this.progress =
        parseFloat(parseInt(current) / parseInt(total)).toFixed(2) * 100;
      this.progress = this.progress >= 100 ? 100 : this.progress;
    },
    // 获取时长
    getDuration() {
      let audioDom = this.$refs.audioDom;
      this.timer1 = setInterval(() => {
        if (audioDom.readyState != 0) {
          this.loading = false;
          this.durationTime = audioDom.duration;
          this.duration = audioDom.duration;
          clearInterval(this.timer1);
        }
      }, 200);
    },
    // 监控播放进度
    observerProgress() {
      let musicId = this.data.id || 0;
      const AudioDom = this.$refs.audioDom;
      let audioDuration = null;
      let isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isIOS) {
        this.loading = false;
      }
      this.timer2 = setInterval(() => {
        if (AudioDom.readyState === 4) {
          this.loading = false;
          if (audioDuration === null) {
            audioDuration = AudioDom.duration;
            this.durationTime = AudioDom.duration;
            this.duration = AudioDom.duration;
          }
          this.playStatusTime = AudioDom.currentTime;
          this.progress = parseInt(
            (AudioDom.currentTime / audioDuration) * 100
          );
          localStorage.setItem("musicId", musicId);
          localStorage.setItem("currentTime", AudioDom.currentTime);
          if (AudioDom.ended) {
            this.playStatus = false;
            this.playEnd = true;
            this.end();
            clearInterval(this.timer2);
          }
        }
      }, 1000);
    },
    // 监控音频播放结束
    end() {
      this.$emit("end");
    },
    // 判断是否有记忆播放状态
    judegPlayStatus() {
      if (this.data.hasOwnProperty("id") && this.data.id !== "") {
        let musicId = localStorage.getItem("musicId");
        let cookieCurrentTime = localStorage.getItem("currentTime");
        if (musicId !== null && musicId == this.data.id) {
          this.$refs.audioDom.currentTime = cookieCurrentTime;
        }
      }
    },
    transformTime
  },
  watch: {
    "data.src": {
      handler(newVal, oldVal) {
        this.reset();
      },
      deep: true
    }
  },
  destroyed() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  }
};
</script>
<style lang="scss" scoped>
.audioPlayer {
  display: block;
  width: 100%;
  height: 80px;
  padding: 5px 6px;
  box-sizing: border-box;
  position: relative;
  .audio {
    width: 1px;
    height: 1px;
    opacity: 0;
  }
  .audioCard {
    width: 100%;
    height: 100%;
    .playBtn {
      float: left;
      width: 50px;
      height: 50px;
      margin-top: 10px;
      position: relative;
      z-index: 2;
      /*! autoprefixer: off */
      background: -webkit-linear-gradient(left top, #ff6773, #fe5263);
      /* autoprefixer: on */
      background: linear-gradient(left top, #ff6773, #fe5263);
      box-shadow: 0 2px 10px rgba(254, 70, 86, 0.3);
      border-radius: 50%;
      &.cover {
        background-position: center;
        background-color: #efefef;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 4px;
        box-shadow: none;
      }
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url("./img/playIco.png") no-repeat 60% center;
        background-color: rgba(0, 0, 0, 0);
        background-size: 50% auto;
      }
      &.pause::after {
        background-image: url("./img/pauseIco.png");
        background-position: 56% center;
        background-size: 50% auto;
      }
      &.loading::after {
        background-image: url("./img/loading.png");
        background-position: center;
        background-size: 50% auto;
        animation: rotateFrame 3s infinite linear;
      }
    }
    .info {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 15px 10px 0 70px;
      box-sizing: border-box;
      .tit {
        display: block;
        font-size: 12px;
        width: 100%;
        height: 14px;
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #979797;
        white-space: nowrap;
        padding-bottom: 8px;
      }

      .bomStatus {
        width: 100%;
        height: 14px;
        line-height: 14px;
        .progress {
          float: left;
          width: 95%;
          height: 2px;
          background: rgba(237, 237, 237, 0.4);
          border-radius: 2px;
          margin-top: 5px;
          cursor: pointer;
          position: relative;
          .progressBar {
            width: 95%;
            height: 100%;
            border-bottom-left-radius: 2px;
            border-top-left-radius: 2px;
            background: #fe5263;
          }
          .dot {
            position: absolute;
            top: -6px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: rgba(254, 70, 86, 0.17);
            &::after {
              content: "";
              position: absolute;
              left: 50%;
              top: 50%;
              margin: -3px 0 0 -3px;
              width: 6px;
              height: 6px;
              /*! autoprefixer: off */
              background: -webkit-linear-gradient(left top, #ff6773, #fe5263);
              /* autoprefixer: on */
              background: linear-gradient(left top, #ff6773, #fe5263);
              border-radius: 50%;
            }
          }
        }
      }
      .timeCover {
        font-size: 10px;
        color: #333;
        overflow: hidden;
        line-height: 10px;
        padding-top: 4px;
        width: 95%;
        .timeStatus {
          float: left;
        }
        .timeOver {
          float: right;
        }
      }
    }
  }
}

@keyframes rotateFrame {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>