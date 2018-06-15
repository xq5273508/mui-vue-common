import {PermissionService} from "./Permission";
import "../common/common.css";

// let MIN_SOUND_TIME = 800; //最少录音时长
let recorder = null; //录音对象
let startTimestamp = null; //开始时间
let stopTimestamp = null; //结束时间
let audioLength = 0; //录音时长
let currentfile = null; //当前播放文件路径

let isCreatedEle = false; //是否已经创建录音节点
let soundAlert; //录音弹出框
let audioTips; //录音弹出框提示

let player = null;
let timeoutid = 0;
let audioDir = "_doc/audio/";
let _mask;


//创建弹出窗口
function createRecordWindow() {

  if (!_mask) {
    _mask = mui.createMask(); //callback为用户点击蒙版时自动执行的回调；
    _mask[0].classList.add("mui-backdrop-transparency");
  }

  let divRecord = document.createElement("div");
  divRecord.setAttribute("id", "sound-alert");
  divRecord.setAttribute("class", "rprogress");

  let divChedule = document.createElement("div");
  divChedule.setAttribute("class", "rschedule");
  divRecord.appendChild(divChedule);

  let divSigh = document.createElement("div");
  divSigh.setAttribute("class", "r-sigh");
  divSigh.innerHTML = "!";
  divRecord.appendChild(divSigh);

  let divTips = document.createElement("div");
  divTips.setAttribute("id", "audio-tips");
  divTips.setAttribute("class", "rsalert");
  divTips.innerHTML = "正在录音，请讲话";
  divRecord.appendChild(divTips);

  document.body.appendChild(divRecord);

  soundAlert = document.getElementById("sound-alert"); //录音弹出框
  audioTips = document.getElementById("audio-tips"); //录音弹出框提示
}

//开始录音
function startRecordAudio() {
  return new Promise((resolve, reject) => {
    if (!PermissionService.check("RECORD")) {
      return reject("没有录音权限");
    }
    // 获取当前设备的录音对象
    recorder = plus.audio.getRecorder();
    if (recorder == null) {
      return reject("录音对象未获取");
    }

    //创建录音效果
    if (isCreatedEle === false) {
      createRecordWindow();
      isCreatedEle = true;
    }

    // $rootScope.$broadcast("stop_audio");

    _mask.show();
    //弹出显示录音
    soundAlert.style.display = 'block';
    soundAlert.style.opacity = 1;

    //记录开始时间
    startTimestamp = Date.now();

    //超时自动停止
    timeoutid = setTimeout(function () {
      mui.toast("最长只能录制60秒！");
      stopRecordAudio();
    }, 60000);

    //录音设置
    recorder.record({
      format: "amr",
      filename: audioDir
    }, function (path) {
      //录音成功
      stopTimestamp = Date.now();
      if ((stopTimestamp - startTimestamp) < 1000) {
        return reject("录音时长太短，请长按录音！");
      }
      audioLength = Math.ceil((stopTimestamp - startTimestamp) / 1000);
      currentfile = path.replace(audioDir, "");
      if (audioLength > 60) {
        audioLength = 60;
      }
      return resolve({
        length: audioLength,
        name: currentfile,
        path
      });
    }, function (e) {
      //录音失败
      return reject("录音出现异常: " + e.message);
    });
  })
}

//停止录音
function stopRecordAudio() {
  if (timeoutid) {
    clearTimeout(timeoutid);
    //停止录音
    recorder.stop();
    //移除录音效果
    hideRecordWindow();
    timeoutid = 0;
  }
}

//移除录音效果窗口
function hideRecordWindow() {
  if (!soundAlert) {
    return;
  }
  soundAlert.style.opacity = 0;
  soundAlert.style.display = "none";
  _mask.close();
}

//播放本地录音
function playLocalAudio(path) {
  return new Promise((resolve, reject) => {
    //如果当前有播放的录音，则要暂停
    if (player) {
      player.stop();
      player = null;
    }
    player = plus.audio.createPlayer(path);
    player.play(function () {
      player.stop();
      player = null;
      resolve();
    }, function (e) {
      player.stop();
      player = null;
      reject(e);
    });
  })
}

//停止播放录音
function stopLocalAudio() {
  //如果当前有播放的录音，则要暂停
  if (player) {
    player.stop();
    player = null;
  }
}

export class AudioService {
  static async startRecord() {
    return await startRecordAudio();
  }

  static async stopRecord() {
    stopRecordAudio();
  }

  static playLocal(localName) {
    return new Promise((resolve, reject) => {
      //文件是否存在，存在则直接播放
      plus.io.resolveLocalFileSystemURL(audioDir + localName, function (e) {
        playLocalAudio(audioDir + localName).then(function () {
          resolve();
        });
      }, function (error) {
        reject(error);
      });
    })
  }

  //停止播放录音
  static stopLocal() {
    stopLocalAudio();
  }
}