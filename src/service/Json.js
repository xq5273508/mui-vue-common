import {CryptoService} from "./Crypto";

export class JsonService {
  static Clone(_json) {
    return JSON.parse(JSON.stringify(_json));
  }

  static JsonSort(_json) {
    let _newJson = {};
    Object.keys(_json).sort((item1, item2) => item1 < item2 ? -1 : 1).forEach(_key => {
      if (Object.prototype.toString.call(_json[_key]).toLowerCase() == "[object object]") {
        _newJson[_key] = this.JsonSort(_json[_key]);
      }
      else {
        _newJson[_key] = _json[_key];
      }
    });
    return _newJson;
  }

  static JsonString(_json) {
    return JSON.stringify(this.JsonSort(_json));
    // let _sort = arguments.callee;
    // let json_string: string = "{";
    // Object.keys(_json).sort((item1, item2) => item1 < item2 ? -1 : 1).forEach(_key => {
    //   json_string.length > 1 && (json_string += ",");
    //   json_string += JSON.stringify(_key) + ":";
    //   if (Object.prototype.toString.call(_json[_key]).toLowerCase() == "[object object]") {
    //     json_string += _sort(_json[_key]);
    //   }
    //   else {
    //     json_string += JSON.stringify(_json[_key]);
    //   }
    // });
    // json_string= json_string + "}";
    // return json_string;
  }

  static JsonUrlParam(_json) {
    _json = this.JsonSort(_json);
    return Object.keys(_json).map(_key => {
      return _key + "=" + encodeURIComponent(_json[_key]);
    }).join("&");
  }

  static JsonMd5(_json) {
    return CryptoService.md5(this.JsonString(_json));
  }
}
