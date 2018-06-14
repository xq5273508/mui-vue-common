<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon icon-back mui-pull-left">扫描二维码/条形码</a>
            <a @click="popover" class="right-menu-icon icon-more"></a>
            <a @click="toggle" class="right-menu-words">{{isTurnOn?"关":"开"}}灯</a>
        </header>
        <div class="mui-scroll-wrapper">
            <div id="bcid"></div>
            <div id="detail">
                <h4 style="margin-top: 25vh;">扫描结果</h4>
                <p>http://m.maidiyun.com</p>
                <button class="mui-btn mui-btn-mini">继续访问</button>
                <p id="compname" style="margin-top: 5vh;display: none;"></p>
                <p id="tip" style="display: none;" class="font-13">（该迈迪国标通用物联码未绑定产品）</p>
            </div>
        </div>
    </div>
</template>

<script>
  import {PermissionService} from "../service/Permission";
  import {ToastService} from "../service/Toast";

  export default {
    name: "app-scan",
    data() {
      return {
        isTurnOn: false,
        scan: null
      }
    },
    methods: {
      //二维码扫描成功
      onmarked(type, result, file) {
        if (file && type === "QR_CODE" && mui.os.android) {
          type = 0;
          result = result.substring(1, (result.length - 1));
        }
        switch (type) {
          case plus.barcode.QR:
            type = "QR";
            break;
          case plus.barcode.EAN13:
            type = "EAN13";
            break;
          case plus.barcode.EAN8:
            type = "EAN8";
            break;
          default:
            type = "其它" + type;
            break;
        }
        result = result.replace(/\n/g, '');
        this.fireCallback(type, result);
      },
      popover() {
        let iconmoreClose = plus.nativeUI.actionSheet({
          cancel: "取消",
          buttons: [{
            title: "手工输入"
          }]
        }, (e) => {
          if (e.index == 2) {
            let time = Date.now();
            plus.gallery.pick(function (path) {
              let newTime = Date.now();
              if ((newTime - time) > 1200) {
                plus.barcode.scan(path, this.onmarked.bind(this), error => {
                  plus.nativeUI.alert("无法识别此图片");
                });
              } else {
                mui.toast("请返回重新选择相册！");
              }
            }, function (err) {
              //		plus.nativeUI.alert("Failed: " + err.message);
            }, {
              filter: "image"
            });
          } else if (e.index === 1) {
            plus.nativeUI.prompt("当迈迪国标通用物联码难以正常扫描时，可以手工录入码值，进行识别。", e => {
              if (e.index === 0) {
                let _val = e.value || "";
                _val = _val.replace(/(^\s+)|(\s+$)/ig, "");
                if (_val === "") {
                  mui.alert("请输入迈迪国标通用物联码!");
                } else {
                  this.fireCallback('QR', _val);
                }
              }
            }, "请输入迈迪国标通用物联码", "", ["确认", "取消"]);
          }
        });
        window.close_popover = function () {
          iconmoreClose.close();
        }
      },
      //返回码值
      fireCallback(codeType, codeValue) {
        document.getElementById('compname').style.display = "none";
        document.getElementById('tip').style.display = "none";
        this.scan.close();
        let view = plus.webview.currentWebview();
        let opener = view.opener();
        if (view.callback) {
          let temp = {
            type: codeType,
            value: codeValue
          };
          opener.evalJS(view.callback + "(" + JSON.stringify(temp) + ")");
        }
        view.close();
      },
      toggle() {
        //打开/关闭闪光灯
        this.isTurnOn = !this.isTurnOn;
        this.scan.setFlash(this.isTurnOn);
      }
    },
    mounted() {
      if (!PermissionService.check("CAMERA")) {
        ToastService.message("没有相机权限");
        return false;
      }
      try {
        this.scan = new plus.barcode.Barcode('bcid');
        this.scan.onmarked = this.onmarked.bind(this);
        this.scan.start();
        // 显示页面并关闭等待框
        plus.webview.currentWebview().show("pop-in");
      } catch (e) {
        ToastService.error(e.message);
      }
    }
  }
</script>

<style scoped>
    #bcid {
        width: 100%;
        position: absolute;
        top: 44px;
        bottom: 0;
        text-align: center;
        background-color: #1a1a1a;
    }

    footer {
        width: 100%;
        height: 44px;
        position: absolute;
        bottom: 0;
        line-height: 44px;
        text-align: center;
        color: #FFF;
    }

    .mui-spinner {
        margin-top: 30vh;
    }

    #detail {
        width: 100%;
        position: absolute;
        top: 44px;
        bottom: 0;
        text-align: center;
        background-color: #f7f7f7;
        -webkit-transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        -webkit-transform: translate3d(0px, 1000px, 0px) translateZ(0px);
        transform: translate3d(0px, 1000px, 0px) translateZ(0px);
        -webkit-transition-duration: 500ms;
        transition-duration: 500ms;
    }

    #detail.to-top {
        -webkit-transform: translate3d(0px, 0px, 0px) translateZ(0px);
        transform: translate3d(0px, 0px, 0px) translateZ(0px);
    }

    #detail.to-bottom {
        -webkit-transform: translate3d(0px, 100vh, 0px) translateZ(0px);
        transform: translate3d(0px, 100vh, 0px) translateZ(0px);
    }

    #detail p {
        font-size: 16px;
        word-break: break-all;
        color: #333;
    }

    .img-light {
        width: 24px;
        position: absolute;
        right: 45px;
        margin: 10px;
    }

    .mui-scroll-wrapper {
        overflow: hidden;
    }

    header + .mui-scroll-wrapper,
    header + .md-tab {
        margin-top: 0;
    }
</style>
