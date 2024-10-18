let btn = document.querySelector('#search-btn');
let result = document.getElementById('meal');
const mealList = document.getElementById('meal');
const favList = document.getElementById('show-meal');
const filterList = document.getElementById('filter-meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const favBtn = document.querySelector('#favorites-btn');
let filterMeal = document.getElementById('filter-meal');
let getRecipe = () => {
    let search_text = document.getElementById('search-input').value.trim();
    if(search_text == ''){
        mealList.innerHTML = `<h3>Please enter an ingredient name</h3>`;
    }
    else{
        let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search_text}`;

        fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let html = "";
            data.meals.forEach(meal => {
                html  += `
            <div class = "meal-item" data-id="${meal.idMeal}">
                <div class = "meal-img">
                <img src = "${meal.strMealThumb}" alt = "food">
                </div>
                <div class = "meal-name">
                <h3>${meal.strMeal}</h3>
                <a href = "#" class = "recipe-btn">Get Recipe</a>
                <a href="#" class="fav-btn">Add to Favorites</a>
                </div>
            </div>
            `;
            });
            mealList.innerHTML = html;
        })
        .catch(() =>{
            html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
        });
        
    }

    document.getElementById('favDiv').style.display = 'none';
    document.getElementById('filterDiv').style.display = 'none';
    document.getElementById('mealDiv').style.display = 'block';   
    document.getElementById('mealResultDiv').style.display = 'block';
} 


let getMealRecipe = (e) => {
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
    else if(e.target.classList.contains('fav-btn')){
        let mealItem = e.target.parentElement.parentElement;
        //alert(mealItem.dataset.id);
        let mealId = mealItem.dataset.id;
        var lsNames = localStorage.getItem('mealId');
        arr = lsNames ?  lsNames.split(',') : [];
        //arr = lsNames.split(',');
        
        arr.push(mealId);
        lsNames = arr.join(',');
        localStorage.setItem("mealId", lsNames);  
        alert('Dish added to favorite list');           
    }
}

// create a modal
let mealRecipeModal = (meal) => {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

let getFavorites = () => {
    let ls = localStorage.getItem('mealId');
    let showMeal = document.getElementById('show-meal');
    let mealIds = ls ?  ls.split(',') : [];
    //let mealIds = ls.split(',');
    //alert(mealIds.length);
    let html = ''; 
    if(ls){
            
        for(let i=0;i<mealIds.length;i++){
            
            //alert(mealIds[i]);
            let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealIds[i]}`;
            fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                    
                html += `
                <div class = "meal-item" data-id="${data.meals[0].idMeal}">
                    <div class = "meal-img">
                    <img src = "${data.meals[0].strMealThumb}" alt = "food">
                    </div>
                    <div class = "meal-name">
                    <h3>${data.meals[0].strMeal}</h3>
                    <a href = "#" class = "recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
            showMeal.innerHTML = html;
        })
        .catch(() =>{
            
        });
        }   
    
    }
    else{
        html = `
        <h1>Your favorite list is empty</h1>
        `;
        showMeal.innerHTML = html;
    }
    document.getElementById('favDiv').style.display = 'block';
    document.getElementById('mealDiv').style.display = 'none';
    document.getElementById('filterDiv').style.display = 'none';
    document.getElementById('mealResultDiv').style.display = 'none';
    
}

let filterDropdown = () => {
    let dropdown = document.getElementById('filter-dropdown');
    let url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let html = "<option>Select</option>";
            data.categories.forEach(category => {
                html  += `
                <option value="${category.strCategory}">${category.strCategory}</option>
            `;
            });
            dropdown.innerHTML = html;
            filterMeal.innerHTML = '';
        });
        
        document.getElementById('mealDiv').style.display = 'none';
        document.getElementById('favDiv').style.display = 'none';
        document.getElementById('filterDiv').style.display = 'block';
}

let getFilterMeals = () => {
    let mealId= document.getElementById('filter-dropdown').value.trim();
    let filterMeal = document.getElementById('filter-meal');
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${mealId}`;
    fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
        let html = "";
        data.meals.forEach(meal => {
            html  += `
        <div class = "meal-item" data-id="${meal.idMeal}">
            <div class = "meal-img">
            <img src = "${meal.strMealThumb}" alt = "food">
            </div>
            <div class = "meal-name">
            <h3>${meal.strMeal}</h3>
            <a href = "#" class = "recipe-btn">Get Recipe</a>
            <a href="#" class="fav-btn">Add to Favorites</a>
            </div>
        </div>
        `;
        });
        filterMeal.innerHTML = html;
    })
    .catch(() =>{
       
    });
    
}


btn.addEventListener("click",getRecipe);
mealList.addEventListener('click', getMealRecipe);
favList.addEventListener('click', getMealRecipe);
filterList.addEventListener('click', getMealRecipe);
favBtn.addEventListener('click', getFavorites);
document.getElementById('search-btns').addEventListener("click",function(){
    document.getElementById('mealDiv').style.display = 'block';
    document.getElementById('favDiv').style.display = 'none';
    document.getElementById('filterDiv').style.display = 'none';
    document.getElementById('search-input').value="";
});
document.getElementById('filter-btn').addEventListener("click",filterDropdown);
document.getElementById('filter-dropdown').addEventListener('click',getFilterMeals);