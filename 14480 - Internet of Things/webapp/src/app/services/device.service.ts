import { Injectable } from '@angular/core';
import {DeviceDetectorService, DeviceInfo} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private _deviceDetectorService: DeviceDetectorService) {
    this.deviceInfo = _deviceDetectorService.getDeviceInfo();
  }

  private deviceInfo: DeviceInfo;

  getInfo() {
    return this.deviceInfo;
  }

  getFingerprint() {
    const deviceInfoStr = JSON.stringify(this.deviceInfo);
    const deviceInfoB64 = window.btoa(deviceInfoStr);
    return deviceInfoB64.substring(deviceInfoB64.length - 20);
  }
}
