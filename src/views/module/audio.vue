<template>
    <div>
        <div class="mui-content">
            <h5 class="mui-content-padded" style="margin: 15px 10px;">录音列表，拖拽(滑动)删除</h5>
            <ul class="mui-table-view">
                <li v-for="_audio in audio" :key="_audio.timestamp" class="mui-table-view-cell">
                    <div class="mui-slider-right mui-disabled ">
                        <a class="mui-btn mui-btn-red" @click="remove(_audio)">删除</a>
                    </div>
                    <div class="mui-slider-handle">
                        <p class="progress">{{_audio.progressText}}</p>
                        <div @click="togglePlay(_audio,$event)" class="play"
                             :class="_audio.playing?'playing':''" title="暂停/播放"></div>
                    </div>
                </li>
            </ul>
        </div>
        <button @touchstart="start" @touchend="end" type="button" class="mui-btn button-hold">
            按住说话
        </button>
    </div>
</template>

<script>
  import {AudioService} from "../../service/Audio";

  export default {
    name: "app-audio",
    data() {
      return {
        audio: [],
        timer: 0,
        current: {}
      };
    },
    methods: {
      progress(_audio, _progress) {
        _audio.progress = _progress === undefined ? _audio.file.length : _progress;
        _audio.progressText = "00:" + (_audio.progress < 10 ? "0" : "") + _audio.progress;
      },
      play(_audio) {
        AudioService.playLocal(_audio.file.name);
        this.current = _audio;
        _audio.playing = true;
        this.progress(_audio);
        this.timer = setInterval(() => {
          if (_audio.progress > 0) {
            this.progress(_audio, _audio.progress - 1);
          } else {
            clearInterval(this.timer);
            this.stop();
          }
        }, 1000);
      },
      stop() {
        if (this.current && this.current.playing) {
          this.progress(this.current);
          this.current.playing = false;
          AudioService.stopLocal();
          clearInterval(this.timer);
          this.timer = 0;
          this.current = {};
        }
      },

      togglePlay(_audio, $event) {
        if (this.current) {
          this.stop();
        }
        if (this.current !== _audio) {
          this.play(_audio);
        }
        $event.stopPropagation();

      },
      start() {
        AudioService.startRecord().then((_audio) => {
          const file = {
            timestamp: Date.now(),
            playing: false,
            file: _audio
          };
          this.progress(file);
          this.audio.push(file);
        });
      },
      end() {
        AudioService.stopRecord();
      },
      remove(_audio) {
        const index = this.audio.findIndex(audio => _audio === audio);
        if (~index) {
          this.audio.splice(index, 1);
        }
      }
    }
  }
</script>

<style scoped>
    .button-hold {
        width: 80vw;
        position: absolute;
        bottom: 20px;
        left: 10vw;
    }

    .mui-table-view-cell.mui-active {
        background-color: #ffffff;
    }

    .mui-table-view-cell.mui-active > .mui-slider-handle {
        background-color: transparent;
    }

    .play {
        width: 40px;
        height: 40px;
        background: url(./images/icon.jpg);
        cursor: pointer;
        float: left
    }

    .play {
        background-position: -110px 0
    }

    .playing {
        background-position: -207px 0
    }

    .progress {
        float: right;
        padding-right: 20px;
        line-height: 40px;
    }


</style>
