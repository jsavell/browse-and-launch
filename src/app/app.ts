import {IpcService} from "./IpcService";
import {Movie} from "../electron/model/Movie";
import {Device} from "../electron/model/Device";

const ipc = new IpcService();

document.getElementById('request-movies').addEventListener('click', async () => {

  const data = await ipc.send<{ movies: Movie[] }>('movies-data');
  let movieHtml:string = detailsView(data.movies);
  document.getElementById('movies').innerHTML = movieHtml;
});

document.getElementById('list-dial-devices').addEventListener('click', async () => {
	const data = await ipc.send<{ devices: Device[] }>('devices-data');
});

let detailsView = function(movies:Movie[]):string {
  let movieHtml = "<div class='list-view'>";
  for (let movie of movies) {
    movieHtml +=
        "<div class='movie'>"+
            "<div style='float:left;width:107px;height:160px;margin-right:10px'>"+
            "  <a href='"+movie.url+"' target='_blank'><img src='"+movie.thumbnail+"' /></a>"+
            "</div>"+
            "<h4><a href='"+movie.url+"' target='_blank'>"+movie.title+"</a></h4>"+
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
            "  <a href='"+movie.url+"' target='_blank'><img src='"+movie.thumbnail+"' /></a>"+
            "</div>";
  }
  movieHtml += '</div>';
  return movieHtml;
};