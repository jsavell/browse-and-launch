import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../shared/IpcRequest";
import {execSync} from "child_process";
import {Device} from "../model/Device";

export class DevicesChannel implements IpcChannelInterface {
  getName(): string {
    return 'devices-data';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

	  const {net} = require('electron');
    console.log("Getting Dial ready");
    var dial = require("peer-dial");
    var dialClient = new dial.Client();
    console.log("Have a Dial client");
    dialClient.on("ready",function(){
      console.log("DIAL client is ready");
    }).on("found",function(deviceDescriptionUrl:string, ssdpHeaders:any){
      console.log("DIAL device found");
      console.log("Request DIAL device description from",deviceDescriptionUrl);
      dialClient.getDialDevice(deviceDescriptionUrl, function (dialDevice:any, err:any) {
        let devices:Device[] = [];
        if(dialDevice){
          console.log("Got DIAL device description: ",dialDevice);
          event.sender.send(request.responseChannel, { device:{name:dialDevice.friendlyName,ip:dialDevice.applicationUrl} });
        }
        else if(err){
          console.error("Error on get DIAL device description from ",deviceDescriptionUrl, err);
        }
      });
    }).on("disappear", function(deviceDescriptionUrl:any, dialDevice:any){
        console.log("DIAL device ", deviceDescriptionUrl," disappeared");
    }).on("stop", function(){
        console.log("DIAL client is stopped");
    }).start();

    setTimeout(function() {dialClient.stop();}, 10000);
  }
}
