<template>
  <div :class="['notify', type]">
    <p class="text">{{text}}</p>
  </div>
</template>

<script>
export default {
  name: "Notify",
  data() {
    return {
      text: "",
      type: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.notify {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 999999;
  overflow: hidden;
  min-width: 200px;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.spread{
    animation: spread 1s ease;
  }
  &.spreadOut{
    animation: spreadOut 1s ease;
  }
  &.fade{
    animation: fade 1s ease;
  }
  &.fadeOut{
    animation: fadeOut 1s ease;
  }
  &.upFade{
    animation: upFade 1s ease;
  }
  &.upFadeOut{
    animation: upFadeOut 1s ease;
  }
  .text {
    padding: 8px 20px;
    font-size: 14px;
    color: #fff;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}
/*展开动画*/
@keyframes spread {
  0% {
    max-height: 0px;
  }
  100% {
    max-height: 200px;
  }
}
@keyframes spreadOut {
  0% {
    max-height: 200px;
  }
  100% {
    max-height: 0px;
  }
}

/*渐隐动画*/
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
/*从上渐隐*/
@keyframes upFade {
  0% {
    top: 46%;
    opacity: 0;
  }
  100% {
    top: 50%;
    opacity: 1;
  }
}
@keyframes upFadeOut {
  0% {
    top: 50%;
    opacity: 1;
  }
  100% {
    top: 46%;
    opacity: 0;
  }
}

</style>