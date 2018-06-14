let _view = null;

export class WindowService {
  static open(win) {
    if (_view) {
      return null;
    }
    if (win.createNew == false) {
      let _win = plus.webview.getWebviewById(win.id);
      if (_win) {
        mui.openWindow(_win);
        return;
      }
    }
    let _aniShow = "pop-in",
      _duration = 160;
    if (mui.os.android) {
      if (parseFloat(mui.os.version) < 4.4) {
        _aniShow = "slide-in-right";
      } else {
        _duration = 250;
      }
    } else {
      _duration = 300;
    }
    win.extras && (win.extras.needLogin = win.needLogin);
    !win.extras && (win.extras = {
      needLogin: win.needLogin
    });

    let options = {
      id: win.id,
      url: win.url,
      show: {
        aniShow: _aniShow,
        duration: _duration
      },
      styles: {
        popGesture: "close"
      },
      waiting: {
        autoShow: false
      },
      extras: win.extras,
      createNew: true
    };
    if (mui.os.android && ["5.0", "5.1"].indexOf(mui.os.version) >= 0 && win.url.indexOf("chat.html") < 0) {
      options.styles.hardwareAccelerated = false;
    }
    _view = mui.openWindow(options);
    _view.addEventListener("close", function () {
      _view = null;
    });
    return _view;
  }
}