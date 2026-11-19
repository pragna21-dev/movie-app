const detailGrid = document.getElementById("detailGrid");
const API_KEY = "f2125cab"; // API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function getDetailMovieApi() {
  detailGrid.innerHTML = "";
  console.log(movieId);

  try {
    const response = await fetch(`${API_URL}i=${movieId}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    detailGrid.innerHTML = `<p class ="text-red-500 m-auto bg-red-100">${error}</p>`;
    console.error("Error is", error);
    return null;
  }
}
function setMovieDetail(movie) {
  detailGrid.innerHTML = `
       <div id="leftDiv" class="flex justify-center items-center m-2 md:m-5">
         <img src="${movie.Poster}"
          alt="${movie.Title}"
          onerror="this.onerror=null; this.src='https://placehold.co/600x600?text=No+Poster'"
          class="rounded-2xl w-40 h-60 md:h-90 md:w-80 xl:h-[450px] xl:w-full" />
          </div>
        <div id="rightDiv" class="m-2 md:m-5">
        <h1 class="text-white text-xl sm:text-3xl font-bold">${movie.Title}</h1>
        <div class="my-5 sm:my-3">
        ${
          movie.Genre && movie.Genre !== "N/A"
            ? movie.Genre.split(",")
                .map(
                  (genere) => `
              <span class="bg-gray-700 text-white rounded-full px-3 py-1 text-xs md:tex-sm font-meduim">${genere}</span>
            `,
                )
                .join("")
            : ""
        }
       
        </div>
        <div class="text-white flex flex-row justify-start items-center py-2">
         ${movie.Ratings.length > 0 ? ` <p class="text-gray-300 text-sm"><i class="fa fa-star text-yellow-500"></i> ${movie.Ratings[0]?.Value} - </p> ` : ""}
         <p class="text-gray-300 text-base mx-2 font-semibold">  ${movie.Type} - </p>
          ${movie.Type == "series" && movie.totalSeasons !== "N/A" ? `<p class="text-gray-300 text-base mx-2 font-semibold"> ${movie.totalSeasons} seasons - </p>` : ""}
           ${
             movie.Runtime && movie.Runtime !== "N/A"
               ? `<p class="text-gray-300 text-base mx-2 font-semibold">
              ${Math.floor(parseInt(movie?.Runtime) / 60) > 0 ? `${Math.floor(parseInt(movie?.Runtime) / 60)}h:` : ""}
                  ${parseInt(movie.Runtime) % 60}m - </p>`
               : ""
           }
         <p class="text-gray-300 text-base mx-2 font-semibold">  ${new Date(movie.Released).getFullYear()}</p>
        </div>
        <div>
        <p class="text-gray-300 text-justify text-sm md:text-base">${movie.Plot && movie.Plot !== "N/A" ? movie.Plot : ""}</p>
       ${movie.Director && movie.Director !== "N/A" ? ` <p class="text-gray-300 my-2"><span class="font-bold mr-2">By:</span>${movie.Director}</p>` : ""}
         ${movie.Actors && movie.Actors !== "N/A" ? ` <p class="text-gray-300 my-2"><span class="font-bold mr-2">Actors:</span>${movie.Actors}</p>` : ""}
        </div>
        </div>
      `;
  //
}

async function showDetail() {
  movieData = await getDetailMovieApi();
  console.log(movieData);

  if (movieData) {
    setMovieDetail(movieData);
  }
}
showDetail();
