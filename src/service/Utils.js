const js_list = [];
const css_list = [];

export class UtilService {
  static guid() {
    let timestamp = new Date().getTime();
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (timestamp + Math.random() * 16) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  static decimalLength(num) {
    return (String(num).split('.')[1] || "").length;
  }

  static divisible(dividend, dividbegin, divisor) {
    let length_dividend = this.decimalLength(dividend);
    let length_dividbegin = this.decimalLength(dividbegin);
    let length_divisor = this.decimalLength(divisor);
    let len_max = length_dividend;
    let multiple;
    len_max = Math.max(len_max, length_dividbegin);
    len_max = Math.max(len_max, length_divisor);
    multiple = Math.pow(10, len_max);
    return (dividend * multiple - dividbegin * multiple) % (divisor * multiple) === 0;
  }

  static jsLoad(_variable, url, attrs = []) {
    return new Promise((resolve, reject) => {
      if (!_variable && js_list.indexOf(url.toLowerCase()) >= 0) {
        resolve();
      }
      else if (_variable && window[_variable]) {
        resolve(window[_variable]);
      }
      else {
        let onReady = function () {
          !_variable && js_list.push(url.toLowerCase());
          resolve(_variable && window[_variable]);
        };
        let _script = document.createElement("script");
        _script.src = url;
        _script.type = "text/javascript";
        attrs && Object.keys(attrs).forEach(_key => {
          _script[_key] = attrs[_key];
        });
        _script.onload = onReady;
        document.body.appendChild(_script);
      }
    })
  }

  static cssLoad(url) {
    return new Promise((resolve, reject) => {
      if (css_list.indexOf(url.toLowerCase()) >= 0) {
        resolve();
      }
      else {
        let onReady = function () {
          css_list.push(url.toLowerCase());
          resolve();
        };
        let _css = document.createElement("link");
        _css.href = url;
        _css.type = "text/css";
        _css.rel = "stylesheet";
        _css.onload = onReady;
        document.head.appendChild(_css);
      }
    })
  }
}
