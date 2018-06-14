export class PermissionService {
  static check(permission) {
    return true;
    return plus.navigator.checkPermission(permission) === "authorized";
  }
}