import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {MovieGroup} from "../electron/model/MovieGroup";

const ipc = new IpcService();

var isLaunchable = function() {
  return (process.env.LAUNCH_HOST && process.env.LAUNCH_PORT && process.env.LAUNCH_PARAMS);
};

document.addEventListener('DOMContentLoaded', async () => {
  const data = await ipc.send<{ movieGroups: MovieGroup[] }>('movies-data');
  let movieHtml:string = gridView(data.movieGroups);
  document.getElementById('movies').innerHTML = movieHtml;

  document.getElementById("letterJumper").innerHTML = buildLetterNav();

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

let buildLetterNav = function():string {
  let letterNav = "<ul><li><a target='_self' href='#numbers'>0</a></li>";

  let n = 0;
  while (n<=25) {
    let letter = String.fromCharCode(65 + n);
    letterNav += "<li><a target='_self' href='#"+letter+"'>"+letter+"</a></li>";
    n = n+1;
  }
  letterNav += "</ul>";
  return letterNav;
};

let insertLetterAnchor = function(letter:string, label:string) {
  return '<div class="letter-anchor" id="'+letter+'">'+label+'</div>';
};

let gridView = function(movieGroups:MovieGroup[]):string {
  let movieHtml = "";
  let lastLetterEntry:string = "0123...";
  movieHtml += insertLetterAnchor('numbers', lastLetterEntry);
  movieHtml += "      <div class='grid-view'>";
  for (let movieGroup of movieGroups) {
    let movie:Movie = movieGroup.movies[0];
    let movieCount:Number = movieGroup.movies.length;
    let firstChar:string = new String(movie.title).charAt(0);
    if (firstChar.match(/\p{Letter}/gu) && !firstChar.match(lastLetterEntry)) {
      movieHtml += '  </div>';
      movieHtml += insertLetterAnchor(firstChar, firstChar);
      movieHtml += "  <div class='grid-view'>";
      lastLetterEntry = firstChar;
    }
    if (movieCount == 1) {
      movieHtml +=
            "          <div class='movie' style='background-image:url("+movie.thumbnail+")'>"+
            "            <a class='do-launch' href='"+movie.url+"' target='_blank'></a>"+
            "            <div class='details'>"+movie.quality+"</div>"+
            "          </div>";
    } else {
      movieHtml +=
            "          <div class='movie' style='background-image:url("+movie.thumbnail+")'>"+
            "            <a class='do-launch' href='"+movie.url+"' target='_blank'></a>"+
            "            <div class='details'>"+movie.quality+" "+movieCount+"</div>"+
            "          </div>";
    }
  }
  movieHtml += '      </div>';
  return movieHtml;
};

