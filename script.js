const searchTxt=document.getElementById('search');
const movieGrid=document.getElementById('movieGrid');
const API_KEY = 'f2125cab'; // API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;
function onMovieSearch(){
// alert(searchTxt;
getMovieApi(searchTxt.value);
}

async function getMovieApi(query){
    //key=f2125cab
console.log(query);
movieGrid.innerHTML="";
    try{
        const response= await fetch(`${API_URL}s=${query}`);
        if(!response.ok){ throw new Error('fetch movie data')}
        const data = await response.json();
         if (data.Response === 'True') {
            setMovieData(data.Search)
         } else{
              movieGrid.innerHTML=`<p class="text-red-500 m-auto bg-red-100">${data.Error} </p>`;
         }   

    }
    catch(error){
            movieGrid.innerHTML=`<p class="text-danger">Something went wrong </p>`;
        console.log('Error is',error);
        
    }

}

function setMovieData(movies){
    console.log(movies);
    movieGrid.innerHTML= movies.map((movie)=>{ 
        return `
        <div class="bg-white rounded-lg shadow-lg m-2 p-2 w-full">
          <img src="${movie.Poster}" alt="${movie.Title}" class="rounded-lg">
        <h2 class="text-sm text-gray-700 font-bold px-1">${movie.Title}</h2>
       <p class="text-sm text-gray-400 font-semibold p-1">${movie.Year}</p>
         </div>
         `
    }).join('');
//  <p class="text-sm text-gray-700 font-bold">${movie.Year}</p>
}