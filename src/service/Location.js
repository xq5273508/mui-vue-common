export class LocationService {
  static get() {
    return new Promise((resolve, reject) => {
      plus.geolocation.getCurrentPosition(function (_location) {
        resolve(_location);
      }, function (error) {
        reject(error);
      });
    });
  }
}