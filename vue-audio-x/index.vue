<template>
    <div class="audioPlayerX">
        <div class="audioCard">
            <button class="playBtn" :class="{'pauseStatus': playStatus, 'loadingStatus': loadingStatus}"
                    @click="togglePlayFn" :diasbled="!loadingStatus"></button>
            <div class="info">
                <p class="tit">{{musicData.title}}</p>
                <div class="bomStatus">
                    <div class="progress" @click="clickProgressFn" ref="progerssDom">
                        <p class="progressBar" :style="{width: progressStr}"></p>
                        <button class="dot" :style="{left: progressStr}" @touchmove="moveProgressFn"></button>
                    </div>
                </div>
                <div class="time-cover">
                    <span class="timeStatus">{{playStatusTime | changeTimeFn}}</span>
                    <span class="timeOver">{{(duration || musicData.audioDuration) | changeTimeFn}}</span>
                </div>
            </div>
        </div>
        <audio :src="musicData.src" ref="audioDom" preload="auto" class="audio"></audio>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            musicData:{
                type: Object,
                required: true,
                default: {
                    title: "起风了",
                    cover: "http://wenba-ooo-qiniu.xueba100.com/cd4ba4a4d6cc0925a9b39d65c3d11ad6.jpeg",
                    src: "http://ting666.yymp3.com:86/new27/mljyyj/1.mp3",
                    audioDuration: '',
                    id: 0
                }
            }
        },
        data () {
            return {
                playStatus: false,
                progress: 0, // 播放进度 0 － 100
                duration: 0, // 总时长（秒）
                durationTime: null, // 总时长（秒）
                playStatusTime: 0, // 当前播放时间（秒）
                playEnd: false, // 播放是否结束状态
                loadingStatus: true,
                timer1: null,
                timer2: null
            }
        },
        computed: {
            progressStr (){
                return (parseInt(this.progress)) + '%';
            }
        },
        mounted (){
            this.judegPlayStatusFn();
            this.getDurationFn();
            this.observerProgressFn();
        },
        methods: {
            // 重置
            reset() {
                this.playStatus = false;
                this.progress = 0;
                this.duration = 0;
                this.playStatusTime = 0;
                this.loadingStatus = false;
            },
            // 播放切换
            togglePlayFn (){
                this.playStatus = !this.playStatus;
                if (this.playStatus) {
                    // play
                    this.loadingStatus = true;
                    if (this.playEnd) {
                        this.$refs.audioDom.currentTime = 0;
                        this.observerProgressFn();
                    }
                    this.$refs.audioDom.play();
                } else {
                    // pause
                    this.$refs.audioDom.pause();
                }
            },
            // 点击
            clickProgressFn (event){
                var offsetX = event.offsetX;
                var progerssWidth = this.$refs.progerssDom.offsetWidth;
                this.calculationFn(offsetX, progerssWidth);
                // 快进
                if (this.durationTime !== null) {
                    this.$refs.audioDom.currentTime = offsetX / progerssWidth * this.durationTime;
                }
            },
            // 拖动
            moveProgressFn (event){
                var progerssLeft = this.$refs.progerssDom.offsetLeft;
                var progerssWidth = this.$refs.progerssDom.offsetWidth;
                var maxClientX = progerssLeft + progerssWidth;
                var clientX = event.touches[0].clientX;
                if (event.touches[0].clientX >= maxClientX) {
                    clientX = maxClientX;
                }
                if (event.touches[0].clientX <= progerssLeft) {
                    clientX = progerssLeft;
                }
                var curLen = clientX - progerssLeft;
                if (clientX > maxClientX) {
                    return false;
                }
                this.calculationFn(curLen, progerssWidth);
                // 快进
                if (this.durationTime !== null) {
                    this.$refs.audioDom.currentTime = curLen / progerssWidth * this.durationTime;
                }
            },
            // 计算进度条
            calculationFn (curLen, totalLen){
                // curlen 当前长度；totleLen 总长
                this.progress = (parseFloat(parseInt(curLen) / parseInt(totalLen))).toFixed(2) * 100;
                this.progress = this.progress >= 100 ? 100 : this.progress;
            },
            // 获取时长
            getDurationFn (){
                var _this = this;
                var audioDom = this.$refs.audioDom;
                this.timer1 = setInterval(function () {
                    if (audioDom.readyState != 0) {
                        _this.loadingStatus = false;
                        _this.durationTime = audioDom.duration;
                        _this.duration = audioDom.duration;
                        clearInterval(_this.timer1);
                    }
                }, 200);
            },
            // 监控播放进度
            observerProgressFn (){
                var _this = this;
                var musicId = this.musicData.id || 0;
                var audioDom = this.$refs.audioDom;
                var audioDuration = null;
                var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (isIOS) {
                    _this.loadingStatus = false;
                }
                this.timer2 = setInterval(function () {
                    if (audioDom.readyState === 4) {
                        _this.loadingStatus = false;
                        if (audioDuration === null) {
                            audioDuration = audioDom.duration;
                            _this.durationTime = audioDom.duration;
                            _this.duration = audioDom.duration;
                        }
                        _this.playStatusTime = audioDom.currentTime;
                        _this.progress = parseInt(audioDom.currentTime / audioDuration * 100);
                        localStorage.setItem('musicId', musicId);
                        localStorage.setItem('currentTime', audioDom.currentTime);
                        if (audioDom.ended) {
                            _this.playStatus = false;
                            _this.playEnd = true;
                            _this.playEndFn();
                            clearInterval(_this.timer2);
                        }
                    }
                }, 1000)
            },
            // 监控音频播放结束
            playEndFn () {
                this.$emit('playEndFn');
            },
            // 判断是否有记忆播放状态
            judegPlayStatusFn (){
                if (this.musicData.hasOwnProperty('id') && this.musicData.id !== '' ) {
                    var musicId = localStorage.getItem('musicId');
                    var cookieCurrentTime = localStorage.getItem('currentTime');
                    if (musicId !== null && musicId == this.musicData.id) {
                        this.$refs.audioDom.currentTime = cookieCurrentTime;
                    }
                }
            }
        },
        filters: {
            // 秒(s) ＝> 00:00
            changeTimeFn (time){
                var timeRxFn = function (x) {
                    var timeRx = new RegExp(/^[0-9]$/g);
                    if (timeRx.test(x)) {
                        return '0' + x;
                    } else {
                        return x;
                    }
                };
                var _time = time;
                var hour = parseInt(_time / 3600); //时
                var minutes = parseInt((_time % 3600) / 60); //分
                var second = parseInt((_time % 3600) % 60); //秒
                var timeStr = hour + ':' + timeRxFn(minutes) + ':' + timeRxFn(second);
                if (hour == 0) {
                    timeStr = timeRxFn(minutes) + ':' + timeRxFn(second);
                }
                return timeStr;
            }
        },
        watch: {
            'musicData.src': {
                handler (newVal, oldVal){
                    this.reset();
                },
                deep: true
            }
        },
        destroyed () {
            clearInterval(this.timer1);
            clearInterval(this.timer2);
        }
    }
</script>
<style>
    .audioPlayerX {
        display: block;
        width: 100%;
        height: 80px;
        padding: 5px 6px;
        box-sizing: border-box;
        position: relative;
    }

    .audioPlayerX .audioCard {
        width: 100%;
        height: 100%;
    }

    .audioPlayerX .audioCard .playBtn {
        float: left;
        width: 50px;
        height: 50px;
        margin-top:10px;
        border-radius: 50%;
        /*! autoprefixer: off */
        background: -webkit-linear-gradient(left top, #FF6773, #FE5263);
        /* autoprefixer: on */
        background: linear-gradient(left top, #FF6773, #FE5263);
        box-shadow: 0 2px 10px rgba(254,70,86,0.3);
        position: relative;
        z-index: 2;
    }

    .audioPlayerX .audioCard .playBtn::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url("./img/playIco.png") no-repeat 60% center;
        background-color: rgba(0, 0, 0, 0);
        background-size: 50% auto;
    }

    .audioPlayerX .audioCard .playBtn.pauseStatus::after {
        background-image: url("./img/pauseIco.png");
        background-position: 56% center;
        background-size: 50% auto;
    }

    .audioPlayerX .audioCard .playBtn.loadingStatus::after {
        background-image: url("./img/loding.png");
        background-position: center;
        background-size: 50% auto;
        animation: rotateFrame 3s infinite linear;
        -webkit-animation: rotateFrame 3s infinite linear;
        -moz-animation: rotateFrame 3s infinite linear;
        -ms-animation: rotateFrame 3s infinite linear;
        -o-animation: rotateFrame 3s infinite linear;
    }

    @keyframes rotateFrame {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-webkit-keyframes rotateFrame {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @-moz-keyframes rotateFrame {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-ms-keyframes rotateFrame {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes rotateFrame {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .audioPlayerX .audioCard .info {
        position: absolute;
        left:0;
        top:0;
        width: 100%;
        padding: 15px 10px 0 70px;
        box-sizing: border-box;
    }

    .audioPlayerX .audioCard .info .tit {
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

    .audioPlayerX .bomStatus {
        width: 100%;
        height: 14px;
        line-height: 14px;
    }

    .audioPlayerX .audioCard .info .progress {
        float: left;
        width: 95%;
        height: 2px;
        background: rgba(237, 237, 237, 0.4);
        border-radius: 2px;
        margin-top: 5px;
        cursor: pointer;
        position: relative;
    }

    .audioPlayerX .audioCard .info .progressBar {
        width: 95%;
        height: 100%;
        border-bottom-left-radius: 2px;
        border-top-left-radius: 2px;
        background: #FE5263;
    }

    .audioPlayerX .audioCard .info .progress .dot {
        position: absolute;
        top: -6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(254, 70, 86, 0.17);
    }

    .audioPlayerX .audioCard .info .progress .dot::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -3px 0 0 -3px;
        width: 6px;
        height: 6px;
        /*! autoprefixer: off */
        background: -webkit-linear-gradient(left top, #FF6773, #FE5263);
        /* autoprefixer: on */
        background: linear-gradient(left top, #FF6773, #FE5263);
        border-radius: 50%;
    }

    .audioPlayerX .time-cover {
        font-size: 10px;
        color: #333;
        overflow: hidden;
        line-height: 10px;
        padding-top: 4px;
        width: 95%;
    }

    .audioPlayerX .timeStatus {
        float: left;
    }

    .audioPlayerX .timeOver {
        float: right;
    }

    .audioPlayerX .audio {
        width: 1px;
        height: 1px;
        opacity: 0;
    }
</style>