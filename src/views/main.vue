<template>
    <div>
        <ul class="mui-table-view mui-grid-view mui-grid-9">
            <li v-for="_menu in menus"
                @click="jump(_menu)"
                class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
                <span class="menu-icon" :class="_menu.icon"></span>
                <div class="mui-media-body">{{_menu.name}}</div>
            </a></li>
        </ul>
    </div>
</template>

<script>
  import {ToastService} from "../service/Toast";
  import {ScanService} from "../service/Scan";
  import {AudioService} from "../service/Audio";
  import {WindowService} from "../service/Window";

  export default {
    name: "app-main",
    data() {
      return {
        menus: [{
          icon: "mui-icon mui-icon-mic",
          name: "录音",
          key: "audio"
        }, {
          icon: "mui-icon mui-icon-image",
          name: "图片",
          key: "camera"
        }, {
          icon: "iconfont icon-qrcode",
          name: "扫码",
          key: "scan"
        }, {
          icon: "iconfont icon-position",
          name: "定位",
          key: "location"
        }, {
          icon: "mui-icon mui-icon-videocam",
          name: "视频",
          key: "video"
        }, {
          icon: "mui-icon mui-icon-upload",
          name: "上传",
          key: "upload"
        }, {
          icon: "mui-icon mui-icon-upload",
          name: "测试功能",
          url: "./aaa/demo.html"
        }]
      };
    },
    methods: {
      jump(_menu) {
        if (_menu.url) {
          WindowService.open({
            id: _menu.key,
            url: _menu.url
          });
        }
        else {
          WindowService.open({
            id: _menu.key,
            url: `./module/${_menu.key}.html`
          });
        }
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>
    .menu-icon {
        font-size: 2.4em;
        font-weight: 400;
        font-style: normal;
        line-height: 1;
        display: inline-block;
        text-decoration: none;
        -webkit-font-smoothing: antialiased;
        color: #057bf9;
    }
</style>
