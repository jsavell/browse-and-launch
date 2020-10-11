import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {MovieGroup} from "../electron/model/MovieGroup";

const ipc = new IpcService();
const electron = require('electron');


console.log("Here I am!");
electron.ipcRenderer.on('movie-catcher', function (event,movieGroup) {
    console.log(movieGroup);
});
document.addEventListener('DOMContentLoaded', async () => {
//  const data = await ipc.send<{ movieGroupJson: string }>('movie-catcher');
//  let movieHtml:string = gridView(data.movieGroups);
//  document.getElementById('movies').innerHTML = movieHtml;
//console.log(data);
//  let movieHtml:string = gridView(data.movieGroup);

  //document.getElementById("letterJumper").innerHTML = buildLetterNav();

});

