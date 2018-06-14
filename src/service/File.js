import {ApiService} from "./Api";

export class FileService {
  static info(_path) {
    let name = _path.substr(_path.lastIndexOf('/') + 1);
    const ext = name.substr(name.lastIndexOf('.') + 1);
    name = name.substr(0, name.lastIndexOf('.'));
    return {name, ext};
  }

  static upload(file, funcKey = "platform") {
    return new Promise((resolve, reject) => {
      const {name, ext} = this.info(file);
      const url = ApiService.Api50 + "/api/v1/File/UploadPic?funcKey=" + funcKey;
      const task = plus.uploader.createUpload(url, {
        method: "post"
      }, function (result, status) {
        const data = JSON.parse(result.responseText);
        if (status === 200 && data.State === 1) {
          resolve(data.Data);
        } else {
          reject(result);
        }
      });
      task.addFile(file, {
        key: name
      });
      task.start();
    });
  }

  static down(path, local) {
    return new Promise((resolve, reject) => {
      const url = ApiService.Api50 + "/api/v1/File/DownLoadPic?filePath=" + path;
      const task = plus.downloader.createDownload(url, {
        filename: local
      }, function (result, status) {
        if (status === 200) {
          resolve(result.filename);
        } else {
          reject("文件下载失败，请重试");
        }
      });
      task.start();
    })
  }
}