<template>
  <div class="confirmBg">
      <div class="content">
          <div class="title">
            <slot name="title">{{title}}</slot>
          </div>
          <div class="message">
            <slot>{{message}}</slot>
          </div>
          <button class="close" @click="cancel"></button>
          <div class="btns" :type="type">
            <button class="sure" @click="sure">{{sureText}}</button>
            <button class="cancel" @click="cancel">{{cancelText}}</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Confirm",
  data() {
    return {
      visible: false,
      type: 'confirm',
      title: '',
      message: '',
      sureText: '',
      cancelText: '',
    };
  },
  methods: {
    alert({title = '', message = ''}) {
      this.type = 'alert';
      this.title = title;
      this.message = message;
    },
    confirm({title = '', message = ''}) {
      this.type = 'confirm';
      this.title = title;
      this.message = message;
      return Promise()
    },
    cancel() {
      this.visible = false;
    },
    sure() {
      this.visible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.confirmBg{
  .content{
    .title{

    }
    .message{

    }
    .btns{
      .sure{

      }
      .cancel{

      }
    }
  }
}
</style>