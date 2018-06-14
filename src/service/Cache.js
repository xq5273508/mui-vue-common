export class CacheService {
  static get(_key) {
    let _data;
    _data = window.sessionStorage.getItem(_key);
    if (_data !== null) {
      return JSON.parse(_data);
    }
    _data = window.localStorage.getItem(_key);
    return _data === null ? undefined : JSON.parse(_data)["data"];
  }

  static set(key, data, local = false) {
    if (local) {
      let temp_data = {
        "data": data,
        "timestamp": Date.now()
      };
      window.localStorage.setItem(key, JSON.stringify(temp_data));
    }
    else {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  static remove(key) {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  }

  static clear() {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
}


