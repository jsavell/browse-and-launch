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
console.log("Have a Dial client:");
console.log(dialClient);
dialClient.on("ready",function(){
    console.log("DIAL client is ready");
}).on("found",function(deviceDescriptionUrl:string, ssdpHeaders:any){
    console.log("DIAL device found");
    console.log("Request DIAL device description from",deviceDescriptionUrl);
    dialClient.getDialDevice(deviceDescriptionUrl, function (dialDevice:any, err:any) {
        if(dialDevice){
            console.log("Got DIAL device description: ",dialDevice);
//            console.log("Request DIAL App from",dialDevice.applicationUrl);

/*
DialDevice {
  descriptionUrl: 'http://192.168.1.143:8060/dial/dd.xml',
  applicationUrl: 'http://192.168.1.143:8060/dial',
  deviceType: 'urn:roku-com:device:player:1-0',
  friendlyName: 'Roku Ultra',
  manufacturer: 'Roku',
  modelName: 'Roku Ultra',
  UDN: 'uuid:29680009-600d-106e-806c-acae19fca2f6',
  icons: []
}
*/
dialDevice.getAppInfo("Roku Media Player", function (appInfo:any, err:any) {
	if (appInfo) {
		console.log("Got RMP app info from "+dialDevice.friendlyName+"!",appInfo);
	}
});
            
            dialDevice.getAppInfo("Roku Media Player", function (appInfo:any, err:any) {
            	
                if(appInfo){
                    console.log("Got YouTube App Info from", dialDevice.applicationUrl+"/Roku%20Media%20Player");
/*                    dialDevice.launchApp("YouTube","v=YE7VzlLtp-4", "text/plain", function (launchRes:any, err:any) {
                        if(typeof launchRes != "undefined"){
                            console.log("YouTube Launched Successfully",launchRes);
                            dialDevice.stopApp("YouTube","run", function (statusCode:any,err:any) {
                                if(err){
                                    console.error("Error on stop YouTube App:", err);
                                }
                                else {
                                    console.log("DIAL stop YouTube App status: ",statusCode);
                                }
                            });
                        }
                        else if(err){
                            console.log("Error on Launch YouTube App",launchRes);
                        }
                    });*/
                }
                else if(err){
                    console.error("Error on get YouTube App Info or YouTube App is not available on",deviceDescriptionUrl);
                }
            });
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
// dialClient.stop();

/*
	deviceRequest.on('response', (response) => {
	    let data = '';
	    response.on('data', (chunk) => {
	        data += chunk;
	    })
	    response.on('end', () => {
	      	let solrData = JSON.parse(data);
	      	var movies:Movie[] = [];
	      	for (let movieData of solrData.response.docs) {
	      		let movie = {title: movieData.title_ss,description: movieData.description_ss,thumbnail: movieData.thumbnail_ss};
	      		movies.push(movie);
	      	}
	    	event.sender.send(request.responseChannel, { movies: movies });
	    })
	  })
	  movieRequest.end()
  }
  */
}
}
