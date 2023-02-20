<template>
  <div class="uploadContainer">
    <ul class="picList">
      <li class="item" v-for="item in data" :key="item.id">
        <img :src="item.src" class="pic" />
        <div class="ctrl">
          <button class="btn" @click="preview(item)">预览</button>
          <button class="btn" @click="remove(item)">删除</button>
        </div>
      </li>
      <!-- 上传进度，暂无 -->
      <!-- <li style="position: relative;background: #eee;" v-show="loadProgressStatus">
        <div class="uploadProgress">
          <p class="txt">{{progressPercent}}</p>
          <div class="progressBox">
            <p class="loaded" :style="{width: progressPercent}"></p>
          </div>
        </div>
      </li>-->
      <li class="item add" v-if="this.data.length < maxlength">
        <input
          type="file"
          class="picruresFileInput"
          :webkitdirectory="directory"
          :accept="accept"
          :multiple="multiple"
          @change="uploadPic($event)"
        />
      </li>
    </ul>
    <div class="blackBg" :class="{'fade': previewBool}">
      <div class="previewContainer">
        <button class="closeBtn" @click="closePreview"></button>
        <img :src="preViewSrc" class="img" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: {
    data: {
      type: Array,
      default(){
        return [];
      } // [{id, src}]
    },
    accept: {
      type: String,
      default: "image/gif, image/jpeg, image/jpg, image/png"
    },
    // 是否支持文件夹
    directory: {
      type: Boolean,
      default: false
    },
    // 图片大小限制，默认为5M
    limit: {
      type: [String, Number],
      default: 5
    },
    // 限制上传图片的数量
    maxlength: {
      type: Number,
      default: 1000 
    },
    // 多张上传
    multiple: {
      type: Boolean,
      default: true 
    },
    // 回传数据类型，base64 || formData
    callbackDataType: {
      type: String,
      default: "base64"
    }
    // progressPercent: {
    //   type: String,
    //   required: false,
    //   default: 0 // 上传进度显示
    // }
  },
  data() {
    return {
      preViewSrc: "",
      previewBool: false
      // loadProgressStatus: false
    };
  },
  methods: {
    preview({ src }) {
      this.preViewSrc = src;
      this.previewBool = true;
    },
    closePreview() {
      this.previewBool = false;
    },
    uploadPic(e) {
      let limit = Number(this.limit);
      let file = e.target;
      let reader = [];
      let _this = this;
      let maxSize = limit * 1024 * 1024;
      let formData = new FormData();
      let callbackData = []; // 回传数据，base64的时候使用
      let promise = []; // onload 队列
      // 判断大小
      for (let i = 0; i < file.files.length; i++) {
        if (file.files[i].size > maxSize) {
          this.$toast(`上传图片大于${limit}M，请重新上传`, 3000);
          return false;
        }
        if (
          _this.accept.indexOf(file.files[i].type) >= 0 &&
          file.files[i].type !== ""
        ) {
          // 自动过滤类型不匹配的文件（在上传文件夹的时候用得到）
          formData.append("file", e.target.files[i]);
        }
      }
      if (this.callbackDataType === "formData") {
        // 回传数据
        this.$emit("done", formData);
      } else {
        // 转码为base64
        for (let i = 0; i < file.files.length; i++) {
          // _this.loadProgressStatus = true;
          promise[i] = new Promise((resolve, reject) => {
            reader[i] = new FileReader();
            reader[i].readAsDataURL(file.files[i]);
            reader[i].onload = function(evt) {
              let regexp = /data:(\S*);base64/;
              let fileType = evt.target.result.match(regexp)[1];
              if (_this.accept.indexOf(fileType) >= 0) {
                // 自动过滤不匹配的文件（在上传文件夹的时候用得到）
                callbackData.push(evt.target.result);
              }
              resolve();
            };
          });
        }
        Promise.all(promise).then(() => {
          this.$emit(
            "done",
            callbackData.length === 1 ? callbackData[0] : callbackData
          );
        });
      }
      file.value = null; // 清空重置
    },
    remove({ id }) {
      this.$emit("remove", id);
    }
  }
};
</script>

<style lang="scss" scoped>
.uploadContainer {
  .blackBg {
    overflow-y: auto;
    box-sizing: border-box;
    opacity: 0;
    transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    z-index: -9;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    &.fade {
      opacity: 1;
      z-index: 99;
    }
    .previewContainer {
      width: 66%;
      height: auto;
      margin: 25% auto;
      padding: 30px 10px 10px;
      box-sizing: border-box;
      background: #fff;
      transition: all 0.5s ease;
      -webkit-transition: all 0.5s ease;
      position: relative;
      .img {
        display: block;
        width: 100%;
        height: auto;
      }
      .closeBtn {
        position: absolute;
        right: 0;
        top: 0;
        display: block;
        width: 30px;
        height: 30px;
        background: url("./assets/img/closeIco.png") no-repeat center;
        background-size: 12px auto;
      }
    }
  }
  .picList {
    overflow: hidden;
    margin: 20px 0 30px 0;
    .item {
      float: left;
      width: 100px;
      height: 100px;
      border-radius: 4px;
      position: relative;
      margin: 0 8px 8px 0;
      cursor: pointer;
      box-sizing: border-box;
      background-color: #eee;
      overflow: hidden;
      &:hover .ctrl {
        opacity: 1;
      }
      &.add {
        line-height: 100px;
        text-align: center;
        background: #f5f5f5 url("./assets/img/addIco.png") no-repeat center;
        background-size: 20% auto;
        border-radius: 6px;
        font-size: 40px;
        font-weight: bold;
        position: relative;
        overflow: hidden;
        .picruresFileInput {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }
      .pic {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .ctrl {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        text-align: center;
        overflow: hidden;
        transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease;
        text-align: center;
        box-sizing: border-box;
        .btn {
          margin-top: 30%;
          display: inline-block;
          width: 36px;
          height: 26px;
          line-height: 26px;
          background-color: #2b89ff;
          font-size: 12px;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>