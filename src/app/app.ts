import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {MovieGroup} from "../electron/model/MovieGroup";
import {Device} from "../electron/model/Device";

const ipc = new IpcService();

var isLaunchable = function() {
  return (process.env.LAUNCH_HOST && process.env.LAUNCH_PORT && process.env.LAUNCH_PARAMS);
};

document.addEventListener('DOMContentLoaded', async () => {
  const data = await ipc.send<{ movieGroups: MovieGroup[] }>('movies-data');
  let movieHtml:string = gridView(data.movieGroups);
  document.getElementById('movies').innerHTML = movieHtml;
});

let rootElement = document.querySelector('body');
  rootElement.addEventListener('click',function(event:any){

    const launcher = event.target.closest("a.do-launch");
    if (!isLaunchable() || !launcher) {
      return;
    }
    event.preventDefault();

    ipc.send<{}>('launcher-data',{responseChannel:'none',params:[launcher.getAttribute("href")]});
});


document.getElementById('settingsMenuLauncher').addEventListener('click',
  function() {
    document.getElementById("settingsMenu").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    document.getElementById("movies").style.transition = "opacity ease 1s";
    document.getElementById("movies").style.opacity = ".2";
  });

document.getElementById('closeSettingsMenu').addEventListener('click',
  function() {
    document.getElementById("settingsMenu").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "#efefef";
    document.getElementById("movies").style.transition = "opacity ease 1s";
    document.getElementById("movies").style.opacity = "1";
  });

/*
let detailsView = function(movieGroups:MovieGroup[]):string {
  let movieHtml = "<div class='list-view'>";
  for (let movie of movies) {
    movieHtml +=
        "<div class='movie'>"+
            "<div style='float:left;width:107px;height:160px;margin-right:10px'>"+
            "  <a class='do-launch' href='"+movie.url+"' target='_blank'><img src='"+movie.thumbnail+"' /></a>"+
            "</div>"+
            "<h4><a class='do-launch' href='"+movie.url+"' target='_blank'>"+movie.title+"</a></h4>"+
            "<p>"+movie.description+
              "<div>"+movie.url+"</div>"+
            "</p>"+
          "</div>";
  }
  movieHtml += '</div>';
  return movieHtml;
};*/

let gridView = function(movieGroups:MovieGroup[]):string {
  let movieHtml = "<div class='grid-view'>";
  for (let movieGroup of movieGroups) {
    let movie = movieGroup.movies[0];
    let movieCount = movieGroup.movies.length;
    if (movieCount == 1) {
      movieHtml +=
            "<div class='movie' style='background-image:url("+movie.thumbnail+")'>"+
            "  <a class='do-launch' href='"+movie.url+"' target='_blank'></a>"+
            "  <div class='details'>"+movie.quality+"</div>"+
            "</div>";
    } else {
      movieHtml +=
            "<div class='movie' style='background-image:url("+movie.thumbnail+")'>"+
            "  <a class='do-launch' href='"+movie.url+"' target='_blank'></a>"+
            "  <div class='details'>"+movie.quality+" "+movieCount+"</div>"+
            "</div>";
    }
  }
  movieHtml += '</div>';

  return movieHtml;
};

let listDevices = function(device:Device):string {
  let deviceHtml = "<ul>";
//  for (let device of devices) {
    deviceHtml += "<li>"+device.name+"</li>";
//  }
  deviceHtml += "</ul>";
  return deviceHtml;
}
