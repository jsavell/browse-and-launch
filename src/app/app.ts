import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {MovieGroup} from "../electron/model/MovieGroup";

const ipc = new IpcService();

var isLaunchable = function(target:Element) {
  return (target.className.indexOf("play-movie") !== -1 && process.env.LAUNCH_HOST && process.env.LAUNCH_PORT && process.env.LAUNCH_PARAMS);
};

document.addEventListener('DOMContentLoaded', async () => {
  const data = await ipc.send<{ movieGroups: MovieGroup[] }>('movies-data');
  let movieHtml:string = gridView(data.movieGroups);
  document.getElementById('movies').innerHTML = movieHtml;

  document.getElementById("letterJumper").innerHTML = buildLetterNav();

});


let rootElement = document.getElementById("movies");
rootElement.addEventListener('click',function(event:any) {
  event.preventDefault();
  const movieDetails = document.getElementById(event.target.getAttribute('href').replace("#",""));
  let movieDetailElement:Element = document.getElementById('movieDetail');
  movieDetailElement.children[0].children[0].innerHTML = movieDetails.innerHTML;
  movieDetailElement.classList.add('active');
  return;
});

document.getElementById("closeMovieDetail").addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('movieDetail').classList.remove('active');
});

let detailsElement = document.getElementById("movieDetailContent");
detailsElement.addEventListener('click', function(event:any) {
  event.preventDefault();

  const launcher = event.target;

  if (isLaunchable(launcher)) {
    ipc.send<{}>('launcher-data',{responseChannel:'none',params:[launcher.getAttribute("href")]});
  }
  return;
});

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
      movieHtml += "<div class='grid-view'>";
      lastLetterEntry = firstChar;
    }
    movieHtml +=
          "          <div class='movie' style='background-image:url("+movie.thumbnail+")'>"+
          "            <a class='show-details' href='#movieDetail_"+movieGroup.id+"'></a>"+
          "            <div class='detail-strip'>"+movie.quality+((movieCount > 1) ? ' '+movieCount:'')+"</div>"+
          "            <div id='movieDetail_"+movieGroup.id+"' class='extras'>"+detailView(movieGroup) +"</div>"+
          "          </div>";
  }
  movieHtml += '    </div>';
  return movieHtml;
};

let getFormattedDate = function(dateString:string):string {
  let date:Date = new Date(String(dateString));
  let day = date.getDate().toString();
  let month = (date.getMonth()+1).toString();
  if (day.length == 1) {
    day = '0'+day;
  }
  if (month.length == 1) {
    month = '0'+month;
  }
  return month+"/"+day+"/"+date.getFullYear();
};

let detailView = function(movieGroup:MovieGroup):string {
  let movie = movieGroup.movies[0];
  let movieHtml:string =
          "<div class='details'>"+
          "  <div class='image'>"+
          "    <img src='"+movie.thumbnail+"' />"+
          "  </div>"+
          "  <h3>"+movie.title+"</h3>"+
          "  <em>"+getFormattedDate(movie.releaseDate)+" - "+movie.quality+"</em>"+
          "  <p>"+((movie.description) ? movie.description:'')+"</p>"+
          "</div>";
  movieHtml += '<div class="play-button-wrap">'+
               '  <a class="button play-movie" href="'+movie.playBackId+'" target="_blank">Play</a>'+
               '</div>';
  movieHtml += '<ul>';
  let x = 0;
  for (let movieEntry of movieGroup.movies) {
    if (x > 0) {
      movieHtml += "<li><a class='play-movie' href='"+movieEntry.playBackId+"' target='_blank'>"+movieEntry.title+" ["+movieEntry.quality+"]</a></li>";
    }
    x++;
  }
  movieHtml += '</ul>';
  return movieHtml;
};
