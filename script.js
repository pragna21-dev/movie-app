const searchTxt = document.getElementById("search");
const movieGrid = document.getElementById("movieGrid");
const movieRecentGrid = document.getElementById("movieRecentGrid");
const movieActionGrid = document.getElementById("movieActionGrid");

const API_KEY = "f2125cab"; // API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let movieSearchData;
let movieRecentData;
let movieActionData;

async function onMovieSearch() {
  movieSearchData = await getSearchMovieApi(searchTxt.value);
  if (movieSearchData) {
    setMovieData(movieSearchData, movieGrid);
  }
}

async function getSearchMovieApi(query) {
  //key=f2125cab

  if (query == "") {
    movieGrid.innerHTML = "";
    movieGrid.innerHTML = `<p class="text-red-500 m-auto bg-red-100">Enter text for search </p>`;
  } else {
    movieGrid.innerHTML = "";
    try {
      const response = await fetch(`${API_URL}s=${query}`);
      const data = await response.json();
      if (data.Response === "True") {
        return data.Search;
      } else {
        throw new Error(data.Error);
      }
    } catch (error) {
      movieGrid.innerHTML = `<p class="text-red-500 m-auto bg-red-100">${error} </p>`;
      console.error("Error is", error);
      return null;
    }
  }
}
async function getRecentMovieApi() {
  movieRecentGrid.innerHTML = "";
  // const currentYear = new Date().getFullYear();
  const currentYear = 2024;
  try {
    const response = await fetch(`${API_URL}s=Avatar&y=${currentYear}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    movieRecentGrid.innerHTML = `<p class ="text-red-500 m-auto bg-red-100">${error}</p>`;
    console.error("Error is", error);
    return null;
  }
}
async function getActionMovieApi() {
  movieActionGrid.innerHTML = "";
  try {
    const response = await fetch(`${API_URL}s=Action`);
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search;
    } else {
      throw new Error(data.Error);
    }
  } catch (error) {
    movieActionGrid.innerHTML = `<p class ="text-red-500 m-auto bg-red-100">${error}</p>`;
    console.error("Error is", error);
    return null;
  }
}

function setMovieData(movies, gridElement) {
  //  onclick="window.location.href='movie-detail.html?id=${movie.imdbID}'"
  gridElement.innerHTML = movies
    .map((movie) => {
      return `
        <div class="movie-card bg-white rounded-lg shadow-lg m-2 p-2 max-w-sm relative cursor-pointer"  data-id="${movie.imdbID}">
          <img src="${movie.Poster}"
          alt="${movie.Title}"
          onerror="this.onerror=null; this.src='https://placehold.co/600x600?text=No+Poster'"
          class="rounded-lg  w-full h-48 ">
          <button class="absolute top-3 right-3 bg-white p-1 rounded-full cursor-pointer" data-id="${movie.imdbID}">
          <i class="
          ${favourites.some((item) => item.imdbID == movie.imdbID) ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart text-gray-500"}"></i>
             </button>        
             <h2 class="text-sm text-gray-700 font-bold p-1 truncate">${movie.Title}</h2>
            <div class ="flex justify-between items-center">          
              <p class="text-xs text-gray-400 font-semibold px-1">${movie.Year}</p>
              <a href="movie-detail.html?id=${movie.imdbID}"> <i class="fa fa-eye text-purple-900 "></i></a>
            </div>
         </div>
         `;
    })
    .join("");
}
movieGrid.addEventListener("click", handleMovieGridClick);
movieRecentGrid.addEventListener("click", handleMovieGridClick);
movieActionGrid.addEventListener("click", handleMovieGridClick);

function handleMovieGridClick(e) {
  const gridName = e.currentTarget.id;
  console.log("Event fired from:", gridName);
  const favBtn = e.target.closest("button[data-id]");

  if (favBtn) {
    e.stopPropagation();
    const movieId = favBtn.dataset.id;
    saveFavouriteToggle(movieId, gridName);
    return;
  }
  const movieCard = e.target.closest(".movie-card");
  if (movieCard) {
    const id = movieCard.dataset.id;
    window.location.href = `movie-detail.html?id=${id}`;
    console.log("Event:", id);
  }
}

function saveFavouriteToggle(movieId, grid) {
  let movieInfo;
  if (grid === "movieGrid") {
    movieInfo = movieSearchData;
    gridElement = movieGrid;
  } else if (grid === "movieActionGrid") {
    movieInfo = movieActionData;
    gridElement = movieActionGrid;
  } else {
    movieInfo = movieRecentData;
    gridElement = movieRecentGrid;
  }
  if (favourites.some((item) => item.imdbID == movieId)) {
    favourites = favourites.filter((item) => item.imdbID !== movieId); //remove from favourites
  } else {
    const favMovie = movieInfo?.find((item) => item.imdbID == movieId);
    if (favMovie) favourites.push(favMovie);
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));

  setMovieData(movieInfo, gridElement);
}

async function displayRecent() {
  movieRecentData = await getRecentMovieApi();
  console.log(movieRecentData);

  if (movieRecentData) {
    setMovieData(movieRecentData, movieRecentGrid);
  }
}
displayRecent();

async function displayAction() {
  movieActionData = await getActionMovieApi();
  console.log(movieActionData);

  if (movieActionData) {
    setMovieData(movieActionData, movieActionGrid);
  }
}
displayAction();
