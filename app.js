const express = require('express')
const axios = require('axios');
const app = express()
const port = 3000

const fullDate = new Date()
const day = fullDate.getDay() - 1
const date = fullDate.getDate()
const month = fullDate.getMonth() + 1
const year = fullDate.getFullYear()
const BASE_URL = `https://www.semma.fi/api/restaurant/menu/week?language=fi&restaurantPageId=206838&weekDate=${year}-${month}-${date}`;

app.get("/", (req, res) => {
const getFood = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    const recipeId = response.data.LunchMenus[day].SetMenus[0].Meals[0].RecipeId
    const recipeApiInfo = await axios.get(`https://www.semma.fi/api/restaurant/menu/recipe?language=fi&recipeId=${recipeId}`)

    const food1 = {
      category : response.data.LunchMenus[day].SetMenus[0].Name,
      food : response.data.LunchMenus[day].SetMenus[0].Meals[0].Name,
      ingredients : recipeApiInfo.data.Ingredients
    }
    const proteinCommaArray = /....(?=...Prote)/.exec(food1.ingredients.toString())
    const proteinDot = Number(proteinCommaArray[0].replace(/,/g, '.')) 
    const kcalCommaArray = /...(?=.kcal)/.exec(food1.ingredients.toString())
    const kcalPerProteinG = Number(kcalCommaArray[0]) / proteinDot
    // console.log(proteinDot);
    // const food2 = response.data.LunchMenus[day].SetMenus[1].Meals[0].Name;
    // const food3 = response.data.LunchMenus[day].SetMenus[2].Meals[0].Name;

    // console.log(`GET: Here's the list of food`, food1, year, month, date);
    res.set("Content-Type", "text/html");
    res.write(`<h1>${food1.category.toString()}</h1>`)
    res.write(`<h2>${food1.food}</h2>`)
    res.write(`<h2>${proteinDot} g protein</h2>`)
    res.write(`<h2>${kcalCommaArray[0]} kcal</h2>`)
    res.write(`<h2>${Math.round(kcalPerProteinG*100)/100} kcal per 1g proteiinia</h2>`)
    res.send()
  } catch (errors) {
    // console.error(errors);
  }
};
getFood()
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})