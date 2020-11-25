import {IpcChannelInterface} from "./IpcChannelInterface";
import {IpcMainEvent} from 'electron';
import {IpcRequest} from "../../shared/IpcRequest";
import {execSync} from "child_process";
import {MovieGroup} from "../model/MovieGroup";
import {Movie} from "../model/Movie";

export class MoviesChannel implements IpcChannelInterface {
  getName(): string {
    return 'movies-data';
  }

  handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

	const {net} = require('electron');
	const movieRequest = net.request({
		  method: 'GET',
		  protocol: 'http:',
		  hostname: process.env.SOLR_HOST,
		  port: Number(process.env.SOLR_PORT),
		  path: '/solr/'+process.env.SOLR_CORE+'/select?q='+process.env.SOLR_FILTER+'&rows='+process.env.SOLR_ROW_COUNT+'&sort=title_ss%20asc'
		})


	movieRequest.on('response', (response) => {
	    let data = '';
	    response.on('data', (chunk) => {
	        data += chunk;
	    })
	    response.on('end', () => {
	      	let solrData = JSON.parse(data);
	      	let movieGroupsBuilder:Map<string,MovieGroup> = new Map();
	      	for (let movieData of solrData.response.docs) {
						let movie = {title: movieData.title_ss,description: movieData.description_ss,thumbnail: movieData.thumbnail_ss, playBackId: movieData.playbackid_ss, quality: movieData.quality_ss, group: movieData.group_ss, releaseDate: movieData.releaseDate_ss};
						let groupId = movie.playBackId;

	      		if (movie.group) {
	      			groupId = movie.group;
	      		}

	      		if (!movieGroupsBuilder.has(String(groupId))) {
	      			movieGroupsBuilder.set(String(groupId), {id: groupId,movies: [movie]});
	      		} else {
	      			movieGroupsBuilder.get(String(groupId)).movies.push(movie);
	      		}
	      	}

	      	let movieGroups:MovieGroup[] = [];
	      	movieGroupsBuilder.forEach(function (v,k,m) {
	      		movieGroups.push(v);
	      	});
	    	event.sender.send(request.responseChannel, { movieGroups:movieGroups });
	    })
	  })
	  movieRequest.end()
  }
}
