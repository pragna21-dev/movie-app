const searchTxt = document.getElementById("search");
const movieGrid = document.getElementById("movieGrid");

const API_KEY = "f2125cab"; // API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let movieSearchData;

async function onMovieSearch() {
  movieSearchData = await getMovieApi(searchTxt.value);
  if (movieSearchData) {
    setMovieData(movieSearchData);
  }
}

async function getMovieApi(query) {
  //key=f2125cab
  movieGrid.innerHTML = "";
  try {
    const response = await fetch(`${API_URL}s=${query}`);
    if (!response.ok) {
      throw new Error("fetch movie data");
    }
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      movieGrid.innerHTML = `<p class="text-red-500 m-auto bg-red-100">${data.Error} </p>`;
      return null;
    }
  } catch (error) {
    movieGrid.innerHTML = `<p class="text-danger">Something went wrong </p>`;
    console.log("Error is", error);
    return null;
  }
}

function setMovieData(movies) {
  movieGrid.innerHTML = movies
    .map((movie) => {
      return `
        <div class="bg-white rounded-lg shadow-lg m-2 p-2 max-w-sm relative">
          <img src="${movie.Poster}"
          alt="${movie.Title}"
          onerror="this.onerror=null; this.src='https://placehold.co/600x600?text=No+Poster'"
          class="rounded-lg  w-full h-48 ">
          <button class="absolute top-3 right-3 bg-white p-1 rounded-full" data-id="${movie.imdbID}">
          <i class="
          ${favourites.some((item) => item.imdbID == movie.imdbID) ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-gray-500"}"></i>
             </button>
          <div class ="flex justify-between items-center">
             <h2 class="text-sm text-gray-700 font-bold p-1">${movie.Title}</h2>
             <p class="text-xs text-gray-400 font-semibold p-1">${movie.Year}</p>
         </div>
         </div>
         `;
    })
    .join("");
}
movieGrid.addEventListener("click", (e) => {
  //use event delegation bubbling
  const favBtn = e.target.closest("button[data-id]");
  if (!favBtn) return;
  console.log(favBtn.dataset.id);
  const movieId = favBtn.dataset.id;
  saveFavouriteToggle(movieId);
});

function saveFavouriteToggle(movieId) {
  if (favourites.some((item) => item.imdbID == movieId)) {
    favourites = favourites.filter((item) => item.imdbID !== movieId); //remove from favourites
  } else {
    const favMovie = movieSearchData.find((item) => item.imdbID == movieId);
    favourites.push(favMovie);
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  setMovieData(movieSearchData);
}
