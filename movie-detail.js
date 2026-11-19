const detailGrid = document.getElementById("detailGrid");
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

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
       <div id="leftDiv" class="flex justify-center items-center m-2 md:m-5 relative">
         <img src="${movie.Poster}"
          alt="${movie.Title}"
          onerror="this.onerror=null; this.src='https://placehold.co/600x600?text=No+Poster'"
          class="rounded-2xl w-40 h-60 md:h-90 md:w-80 xl:h-[450px] xl:w-full" />
            <button  id="favBtn" class="absolute top-3 right-3 bg-white p-1 rounded-full cursor-pointer" data-id="${movie.imdbID}">
          <i class="
          ${favourites.some((item) => item.imdbID == movie.imdbID) ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-gray-500"}"></i>
             </button> 
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
      ${movie.Awards && movie.Awards !== "N/A" ? ` <p class="text-gray-300 my-2"><span class="font-bold mr-2">Awards:</span>${movie.Awards}</p>` : ""}
      ${movie.Country && movie.Country !== "N/A" ? ` <p class="text-gray-300 my-2"><span class="font-bold mr-2">Country:</span>${movie.Country}</p>` : ""}
      ${movie.Language && movie.Language !== "N/A" ? ` <p class="text-gray-300 my-2"><span class="font-bold mr-2">Language:</span>${movie.Language}</p>` : ""}
        </div>
        </div>
      `;
  const favBtn = document.getElementById("favBtn");

  favBtn.addEventListener("click", () => {
    if (favourites.some((item) => item.imdbID == movieId)) {
      favourites = favourites.filter((item) => item.imdbID !== movieId); //remove from favourites
    } else {
      const { Poster, Title, Type, Year, imdbID } = movieData;
      const favMovie = { Poster, Title, Type, Year, imdbID };
      if (favMovie) favourites.push(favMovie);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    if (movieData) {
      setMovieDetail(movieData);
    }
  });
}

async function showDetail() {
  movieData = await getDetailMovieApi();
  console.log(movieData);

  if (movieData) {
    setMovieDetail(movieData);
  }
}
showDetail();
