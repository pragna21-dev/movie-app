const favGrid = document.getElementById("favGrid");
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

function showFavourite() {
  if (favourites && favourites.length > 0) {
    favGrid.innerHTML = favourites
      .map((favMovie) => {
        return `
         <div class="bg-white rounded-lg shadow-lg m-3 p-2 max-w-sm relative ">
          <img src="${favMovie.Poster}"
          alt="${favMovie.Title}"
          onerror="this.onerror=null; this.src='https://placehold.co/600x600?text=No+Poster'"
          class="rounded-lg  w-full h-48 ">
          <button class="absolute top-3 right-3 bg-white p-1 rounded-full" data-id="${favMovie.imdbID}">
          <i class="fa-solid fa-heart text-red-500"></i>
          </button>
          <div class ="flex justify-between items-center">
        <h2 class="text-sm text-gray-700 font-bold p-1">${favMovie.Title}</h2>
       <p class="text-xs text-gray-400 font-semibold p-1">${favMovie.Year}</p>
         </div>
         </div>
        `;
      })
      .join("");
  } else {
    favGrid.innerHTML = `<p class="text-red-500 m-auto bg-red-100 mt-5 px-5 py-2"> No Favourite Data Found </p>`;
  }
}

favGrid.addEventListener("click", (e) => {
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
  }
  localStorage.setItem("favourites", JSON.stringify(favourites));
  showFavourite();
}

showFavourite();
