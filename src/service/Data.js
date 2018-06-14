import Vue from "vue";
import {AuthService} from "./Auth";
import resource from "vue-resource";
import {ToastService} from "./Toast";

Vue.use(resource);
Vue.http.interceptors.push((request, next) => {
  let token = AuthService.token();
  if (token) {
    request.before = function () {
      request.headers.set('Authorization', token);
    };
  }
  next((response) => {
    return response;
  });
});

function ajax(_type, _url, _params = {}) {
  return new Promise((resolve, reject) => {
    Vue.http[_type](_url, _params).then(
      (result) => {
        if (result.body.State == 1) {
          resolve(result.body.Data);
        } else {
          reject(result.body.ErrorMessage);
          result.body.ErrorMessage && ToastService.error(result.body.ErrorMessage);
        }
      }
    )
  })
}

export class DataService {
  static jsonp(_url, _params = {}) {
    return Vue.http.jsonp(_url, {params: _params});
  }

  static get(_url, _params = {}) {
    return ajax("get", _url, {params: _params});
  }

  static post(_url, _params = {}) {
    return ajax("post", _url, _params);
  }
}

