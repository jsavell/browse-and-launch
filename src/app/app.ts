import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {Device} from "../electron/model/Device";

const ipc = new IpcService();

document.getElementById('request-movies').addEventListener('click', async () => {

  const data = await ipc.send<{ movies: Movie[] }>('movies-data');
  let movieHtml:string = gridView(data.movies);
  document.getElementById('movies').innerHTML = movieHtml;
});

document.getElementById('list-dial-devices').addEventListener('click', async () => {
	const data = await ipc.send<{ devices: Device[] }>('devices-data');
});

let rootElement = document.querySelector('body');
  rootElement.addEventListener('click',function(event:any){

    const launcher = event.target.closest("a.do-launch");
    if (!launcher) {
      return;
    }
    event.preventDefault();

    ipc.send<{}>('launcher-data',{responseChannel:'none',params:[launcher.getAttribute("href")]});
});

let detailsView = function(movies:Movie[]):string {
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
};

let gridView = function(movies:Movie[]):string {
  let movieHtml = "<div class='grid-view'>";
  for (let movie of movies) {
    movieHtml +=
            "<div class='movie'>"+
            "  <a class='do-launch' href='"+movie.url+"' target='_blank'><img src='"+movie.thumbnail+"' /></a>"+
            "</div>";
  }
  movieHtml += '</div>';
  return movieHtml;
};
