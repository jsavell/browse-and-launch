import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../shared/IpcRequest";
import {execSync} from "child_process";
import {Movie} from "../model/Movie";

export class LauncherChannel implements IpcChannelInterface {
  getName(): string {
    return 'launcher-data';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    const {net} = require('electron');

    let contentId = encodeURIComponent(request.params[0]);
    let launchUrl = process.env.LAUNCH_PARAMS.replace('{contentId}',contentId);

    const launchRequest = net.request({
            method: 'POST',
            protocol: 'http:',
            hostname: process.env.LAUNCH_HOST,
            port: Number(process.env.LAUNCH_PORT),
            path: launchUrl
          });

    launchRequest.end();
  }
}
