import {WindowService} from "./Window";
import {ViewToRootPath} from "./Path";

export class ScanService {

  // static view;

  static scan() {
    return new Promise((resolve, reject) => {
      window.ScanServiceCallBack = function (data) {
        resolve(data);
        // view.close();
      };
      WindowService.open({
        id: "scan.html",
        url: ViewToRootPath() + "views/scan.html",
        extras: {
          callback: "ScanServiceCallBack"
        }
      });
    })
  }
}