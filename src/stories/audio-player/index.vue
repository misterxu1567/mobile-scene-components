<template>
  <div>
    <AudioPlayer class="audio" :data="data" @end="playEnd" />
    <br/>
    <AudioPlayer class="audio" :data="data2" @end="playEnd" />
  </div>
</template>

<script>
import AudioPlayer from "../../components/audio-player";

export default {
  name: "AudioPlayerDemo",
  components: {
    AudioPlayer
  },
  data() {
    return {
      data: {
        title: "晚风作酒",
        cover: "https://img4.kuwo.cn/star/albumcover/500/46/56/894700586.jpg",
        src: "https://la-sycdn.kuwo.cn/4da1081b4167a3a7e7df543616324694/62bae107/resource/n2/45/84/2335421687.mp3",
        audioDuration: 0,
        id: 0
      },
      data2: {
        title: "晚风作酒",
        src: "https://la-sycdn.kuwo.cn/4da1081b4167a3a7e7df543616324694/62bae107/resource/n2/45/84/2335421687.mp3",
        audioDuration: 0,
        id: 1
      }
    };
  },
  methods: {
    playEnd() {
      console.log("play over");
    }
  }
};
</script>
<style lang="scss" scoped>
.audio {
  background: rgba(248, 248, 248, 0.7);
}
</style>