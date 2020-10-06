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
		  hostname: 'localhost',
		  port: 8983,
		  path: '/solr/movies/select?q=*%3A*&rows=1000&sort=title_ss%20asc'
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
	      		let movie = {title: movieData.title_ss,description: movieData.description_ss,thumbnail: movieData.thumbnail_ss, url: movieData.url_ss, quality: movieData.quality_ss, group: movieData.group_ss};
	      		let groupId = movie.url;

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
