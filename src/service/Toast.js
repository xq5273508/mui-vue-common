export class ToastService {
  static message(_message, duration = 2000) {
    mui.toast(_message, {duration});
  }

  static error(_error) {
    plus.nativeUI.alert(_error);
  }

  static confirm(message, title, buttons = ['取消', '确定']) {
    return new Promise((resolve) => {
      mui.confirm(message, title, buttons, function (e) {
        resolve(e.index)
      })
    })
  }
}