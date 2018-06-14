import {DataService} from "./Data";
import {ApiService} from "./Api";
import {CryptoService} from "./Crypto";

let $ = (window as any).$;

export class ImageUpload {
  blob;
  uploader = null;
  base64 = "";
  key = "";

  constructor(_blob) {
    this.blob = _blob;
  }

  render() {
    return new Promise((resolve) => {
      if (this.base64) {
        resolve(this.key);
      }
      else {
        let reader = new FileReader();
        $(reader).on("load", (e) => {
          this.base64 = e.target.result;
          this.key = CryptoService.md5(this.base64);
          resolve(this.key);
        });
        reader.readAsDataURL(this.blob);
      }
    })
  }

  upload() {
    return this.uploader || (this.uploader = new Promise < string > ((resolve, reject) => {
      this.render().then((key) => {
        let formData = new FormData();
        formData.append("Filedata", this.blob, this.blob.name || ('blob.' + this.blob.type.substr(6)));
        DataService.post(`${ApiService.Api50}/api/v1/File/UploadRichTextPic`, formData).then((guid) => {
          resolve(guid);
        });
      })
    }));
  }
}

export class ImagePoolService {
  static pool = {};

  static get(_image) {
    let uploader;
    if (typeof _image === "string") {
      uploader = this.pool[_image];
    }
    else {
      uploader = new ImageUpload(_image);
      uploader.render().then((key) => {
        this.pool[key] = uploader;
      })
    }
    return uploader;
  }
}
