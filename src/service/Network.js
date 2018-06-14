export class NetworkService {
  static Type() {
    const _type = plus.networkinfo.getCurrentType();
    switch (_type) {
      case plus.networkinfo.CONNECTION_UNKNOW:
        return "未知";
      case plus.networkinfo.CONNECTION_NONE:
        return "未连接网络";
      case plus.networkinfo.CONNECTION_ETHERNET:
        return "有线网络";
      case plus.networkinfo.CONNECTION_WIFI:
        return "WiFi网络";
      case plus.networkinfo.CONNECTION_CELL2G:
        return "2G蜂窝网络";
      case plus.networkinfo.CONNECTION_CELL3G:
        return "3G蜂窝网络";
      case plus.networkinfo.CONNECTION_CELL4G:
        return "4G蜂窝网络";
    }
  }
  static canUse(){
    const _type = plus.networkinfo.getCurrentType();
    return _type!==plus.networkinfo.CONNECTION_UNKNOW&&_type!==plus.networkinfo.CONNECTION_NONE;
  }
}