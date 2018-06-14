import {CacheService} from "./Cache";
import {CryptoService} from "./Crypto";

export class AuthService {
  static user() {
    let User = CacheService.get("user");
    if (!User) {
      CacheService.set("user", User);
    }
    return User;
  }

  static role() {
    return new Promise((resolve) => {
      let User = AuthService.user();
      let roles = [];
      if (User) {
        roles = JSON.parse(CryptoService.base64_decode(User.Token)).Claims.filter((_item) => _item.Type === 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role').map((_item) => _item.Value)
      }
      resolve(roles);
    });
  }

  static auth() {
    return new Promise((resolve) => {
      let User = AuthService.user();
      resolve(User);
    });
  }

  static token() {
    // return "Bearer eyJDbGFpbXMiOlt7IlR5cGUiOiJJZCIsIlZhbHVlIjoiMjA3In0seyJUeXBlIjoiY29tcElkIiwiVmFsdWUiOiIxMSJ9LHsiVHlwZSI6Imh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSIsIlZhbHVlIjoiQmlsbCJ9XSwiRXhwaXJlc1V0YyI6IjIwMTgtMTEtMjdUMDk6MTA6MjYrMDA6MDAifQ==";
    let user = this.user();
    if (user) {
      return "Bearer " + user.Token;
    }
  }
}
