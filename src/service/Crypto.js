import {hex_md5} from "./crypto/Md5";
import {encode, decode} from "./crypto/Base64";

export class CryptoService {
  static md5(str) {
    return hex_md5(str);
  }

  static base64_encode(input) {
    return encode(input);
  }

  static base64_decode(input) {
    return decode(input);
  }
}
