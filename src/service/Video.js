import {PermissionService} from "./Permission";
import {FileService} from "./File";

export class VideoService {
  static startRecord() {
    return new Promise((resolve, reject) => {
      if (!PermissionService.check("CAMERA")) {
        return false;
      }
      setTimeout(function () {
        plus.nativeUI.toast("视频拍摄长度请控制在20秒以内", {
          duration: "long",
          verticalAlign: "top"
        });
      }, 500);
      const cmr = plus.camera.getCamera();
      const resolution = cmr.supportedVideoResolutions[0];
      const format = cmr.supportedVideoFormats[0];
      cmr.startVideoCapture(function (path) {
          var tempPath = plus.io.convertLocalFileSystemURL(path);
          const {name, ext} = FileService.info(path);
          resolve({
            name,
            path: "file://" + tempPath,
            ext,
            size: 0,
            type: 3
          });
        },
        function (error) {
          reject(error);
        }, {
          resolution,
          format
        }
      );
    })
  }

  //停止
  static stopRecord() {
    const cmr = plus.camera.getCamera();
    cmr.stopVideoCapture();
  }

  //获取视频长度
  static getTime(videoId) {
    return new Promise((resolve, reject) => {
      let flag = 0;
      const timer = setInterval(function () {
        if (flag === 100) {
          clearInterval(timer);
          resolve(0);
          return;
        }
        var vDom = document.getElementById(videoId);
        if (vDom && vDom.readyState > 0) {
          if (vDom.duration === Infinity) {
            return;
          }
          clearInterval(timer);
          resolve(vDom.duration.toFixed(0));
        }
        flag++;
      }, 200);
    })
  }

  // //获取视频截图
  // getVideoImg(videoId) {
  //   const defer = $q.defer();
  //   const video = document.getElementById(videoId);
  //   const i = setInterval(function () {
  //     // 这里注意, 必须判断视频的 readyState。
  //     // 如果有可能没加载完，则获取到的视频时长信息是不正确的。
  //     if (video && video.readyState > 0) {
  //       if (video.duration === Infinity) {
  //         return;
  //       }
  //       var scale = 0.25;
  //       var canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth * scale;
  //       canvas.height = video.videoHeight * scale;
  //       canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  //       defer.resolve(canvas.toDataURL("image/png"));
  //       clearInterval(i);
  //     }
  //   }, 200);
  //   return defer.promise;
  // }

  static play(videoId) {
    var v = document.getElementById(videoId);
    var scale = 0.25;
    if (mui.os.android) {
      if (v.webkitRequestFullScreen && typeof(v.webkitRequestFullScreen) === "function") {
        v.webkitRequestFullScreen();
        v.addEventListener('playing', function () {
          var canvas = document.createElement("canvas");
          canvas.width = v.videoWidth * scale;
          canvas.height = v.videoHeight * scale;
          canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
        }, true);
        v.addEventListener('ended', function () {
          v.webkitExitFullScreen();
          //Document.exitFullscreen();
        }, true);
      } else {
        //这里针对低版本android做全屏播放兼容性处理
        plus.runtime.openFile(v.getAttribute("src"));
      }
    } else {
      v.play();
      v.addEventListener('playing', function () {
        var canvas = document.createElement("canvas");
        canvas.width = v.videoWidth * scale;
        canvas.height = v.videoHeight * scale;
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
      }, true);
    }
  }


}