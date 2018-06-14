<template>
    <div>
        <div class="video" v-if="video">
            <img class="bgVideo" src="../../images/play_v.png" @click="play"/>
            <video webkit-playsinline="true" preload="auto" :id="video.path"
                   :src="video.path"
                   onwebkitfullscreenchange="outFullscreen(this)">
            </video>
            <span class="time" v-show="video.size">{{video.size}}</span>
            <img class="media-remove" src="../../images/delete.png" @click="remove"/>
        </div>
        <div @click="record" class="button-video mui-icon mui-icon-videocam"></div>
    </div>
</template>

<script>
  import {VideoService} from "../../service/Video";
  import {ToastService} from "../../service/Toast";


  export default {
    name: "app-video",
    data() {
      return {
        video: null
      };
    },
    methods: {
      record() {
        VideoService.startRecord().then(_video => {
          this.video = _video;
          this.$nextTick(() => {
            VideoService.getTime(this.video.path).then((size) => {
              const minute = Math.floor(size / 60);
              const second = Math.floor(size / 60);
              this.video.size = (minute < 10 ? "0" : "0") + minute + ":" + (second < 10 ? "0" : "0") + second;
            })
          })
        })
      },
      play() {
        VideoService.play(this.video.path);
      },
      remove() {
        ToastService.confirm("是否确认删除改视频?").then(_index => {
          if (_index === 0) {
            this.video = null;
          }
        })
      }
    }
  }
</script>

<style scoped>
    .video {
        width: 100px;
        height: 100px;
        background-color: #EAEAEA;
        position: relative;
        display: block;
        margin: 50px auto;
    }

    .video .bgVideo {
        width: 50px;
        height: 50px;
        z-index: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 !important;
        position: absolute;
        top: 10px;
    }

    .video video {
        display: none;
    }

    .video .time {
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        line-height: 20px;
        background-color: #C8C7CC;
        color: #ffffff;
        font-size: 13px;
    }

    .video .media-remove {
        position: absolute;
        right: -7px;
        top: -7px;
        width: 20px;
        height: 20px;
        padding: 0;
        background-color: initial;
    }

    .button-video {
        width: 80px;
        height: 80px;
        line-height: 80px;
        border-radius: 50px;
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #057bf9;
        color: #ffffff;
        font-size: 30px;
        text-align: center;
    }

</style>