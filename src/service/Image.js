import {PermissionService} from "./Permission";
import {UtilService} from "./Utils";
import {FileService} from "./File";

export class ImageService {

  static fileSize(path) {
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        entry.file(function (file) {
          resolve(file.size);
        });
      }, function (e) {
        reject(e);
      });
    })
  }

  static zipImage(src) {
    return new Promise((resolve, reject) => {
      const reg = new RegExp('(.{' + src.lastIndexOf('.') + '})');
      const zipFile = src.replace(reg, '$1_zip');
      const zipExt = zipFile.substr(zipFile.lastIndexOf('.') + 1, zipFile.length - zipFile.lastIndexOf('.'));
      const zipPath = zipFile.substr(0, zipFile.lastIndexOf('/') + 1) + UtilService.guid() + "." + zipExt;
      plus.zip.compressImage({
        src: src,
        dst: zipPath,
        overwrite: true,
        width: "20%",
        quality: 60
      }, function (e) {
        resolve(zipPath);
      }, function (e) {
        reject(e);
      });
    })
  }

  static capture() {
    return new Promise((resolve, reject) => {
      if (!PermissionService.check("CAMERA")) {
        return false;
      }
      const camera = plus.camera.getCamera();
      camera.captureImage(function (e) {
        resolve("file://" + plus.io.convertLocalFileSystemURL(e));
      }, function (error) {
        reject(error);
      });
    })
  };

  static pick(multi) {
    return new Promise((resolve, reject) => {
      plus.gallery.pick(function (image) {
        resolve(multi ? image.files : image);
      }, function (error) {
        reject(error);
      }, {
        filter: "image",
        multiple: multi || false,
        system: false
      });
    })
  }

  static translate(image) {
    return new Promise((resolve, reject) => {
      const _size = this.fileSize(image);
      const _zip = this.zipImage(image);
      Promise.all([_size, _zip]).then(([size, mini]) => {
        const {name, ext} = FileService.info(image);
        resolve({
          name: name,
          path: image,
          ext: ext,
          size: size,
          type: 1,
          mini: mini
        });
      }, function (error) {
        reject(error);
      });
    })
  }

  static choose(multi) {
    return new Promise((resolve, reject) => {
      const operate = (e) => {
        switch (e.index) {
          case 1:
            this.capture().then(image => {
              this.translate(image).then(_image => resolve(_image), error => reject(error));
            }, function (error) {
              reject(error);
            });
            break;
          case 2:
            this.pick(multi).then((image) => {
              if (image) {
                if (multi) {
                  Promise.all(image.map(_image => this.translate(_image))).then(_image => resolve(_image), error => reject(error));
                }
                else {
                  this.translate(image).then(_image => resolve(_image), error => reject(error));
                }
              } else
                reject();
            });
            break;
        }
      };
      plus.nativeUI.actionSheet({
        title: "添加照片",
        cancel: "取消",
        buttons: [{
          title: "拍照"
        }, {
          title: "从相册选择照片"
        }]
      }, operate);
    })
  }

  static preview(images, _index) {
    plus.nativeUI.previewImage(images, {
      current: _index || 0,
      loop: true,
      indicator: 'number'
    });
  }
}