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

	let launchUrl:string = request.params[0];
  let contentID = encodeURIComponent(launchUrl);
  console.log(contentID);
  const launchRequest = net.request({
      method: 'POST',
      protocol: 'http:',
      hostname: '192.168.1.143',
      port: 8060,
      path: 'launch/dev?mediaType=movie&contentID='+contentID
    });

  launchRequest.end();
/*

	movieRequest.on('response', (response) => {
	    let data = '';
	    response.on('data', (chunk) => {
	        data += chunk;
	    })
	    response.on('end', () => {
	      	let solrData = JSON.parse(data);
	      	var movies:Movie[] = [];
	      	for (let movieData of solrData.response.docs) {
	      		let movie = {title: movieData.title_ss,description: movieData.description_ss,thumbnail: movieData.thumbnail_ss, url: movieData.url_ss};
	      		movies.push(movie);
	      	}
	    	event.sender.send(request.responseChannel, { movies: movies });
	    })
	  })
	  movieRequest.end()*/
  }

}
