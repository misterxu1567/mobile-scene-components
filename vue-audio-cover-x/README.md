> 基于vue的自定义音频组件(封面版)

![Image text](http://wenba-ooo-qiniu.xueba100.com/365c3693561d05d326db47e0659ee5a5.png)

### NPM

``` bash
npm install vue-audio-cover-x -D
```
### Example

```
<template>
    <div id="app">
        <AudioPlayer :musicData="musicData" style="background:rgba(248, 248, 248, 0.7);" @playEndFn="playEndFn"></AudioPlayer>
    </div>
</template>
<script>
    import VueAudio form 'vue-audio-cover-x';

    export default {
        name: 'App',
        components: {
            VueAudio
        },
        data () {
            return {
                musicData: {
                    title: "起风了",
                    cover: "http://wenba-ooo-qiniu.xueba100.com/cd4ba4a4d6cc0925a9b39d65c3d11ad6.jpeg",
                    src: "http://ting666.yymp3.com:86/new27/mljyyj/1.mp3",
                    audioDuration: 0,
                    id: 0
                }
            }
        },
        methods: {
            playEndFn () {
                alert('播放结束');
            }
        }
    }
</script>
```
## Api
### 参数
| Name                 | Type      | Default      | Description                                                        |
|----------------------|-----------|--------------|--------------------------------------------------------------------|
| musicData            | `Object`  |              | 对象（默认值如上例）         |
| title                | `String`  | `起风了`      | 音乐标题  |
| cover                | `String`  |              | 音乐封面图  |
| src                  | `String`  |              | 音频地址  |
| audioDuration        | `Number`  | `0`          | （非必填）音频长度，单位秒（s），兼容部分手机（如iOS）不能获取音频就绪状态  |
| id                   | `Number`  | `0`          | （非必填）音频的唯一id值，附带此数据会记录最后一次音乐的播放进度，下次进入该音乐将直接从上次的进度开始        |
| playEndFn            | `Function`| `0`          | 音频播放结束的回调函数           |

### 其他说明
选择没有封面图的音频组件，可移步查询 vue-audio-x




