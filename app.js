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
    const fullMenu = await axios.get(`${BASE_URL}`);
    const recipeId1 = fullMenu.data.LunchMenus[day].SetMenus[0].Meals[0].RecipeId
    const recipeId2 = fullMenu.data.LunchMenus[day].SetMenus[1].Meals[0].RecipeId
    const recipeApiInfo1 = await axios.get(`https://www.semma.fi/api/restaurant/menu/recipe?language=fi&recipeId=${recipeId1}`)
    const recipeApiInfo2 = await axios.get(`https://www.semma.fi/api/restaurant/menu/recipe?language=fi&recipeId=${recipeId2}`)

    const food1 = {
      category : fullMenu.data.LunchMenus[day].SetMenus[0].Name,
      food : fullMenu.data.LunchMenus[day].SetMenus[0].Meals[0].Name,
      ingredients : recipeApiInfo1.data.Ingredients
    }
    const food2 = {
      category : fullMenu.data.LunchMenus[day].SetMenus[1].Name,
      food : fullMenu.data.LunchMenus[day].SetMenus[1].Meals[0].Name,
      ingredients : recipeApiInfo2.data.Ingredients
    }
    const proteinNumber1 = proteinNumberF(food1)
    const proteinNumber2 = proteinNumberF(food2)
    const kcalNumber1 = kcalNumberF(food1)
    const kcalNumber2 = kcalNumberF(food2)
    const kcalPerProt1 = Math.round(calcProtKcal(kcalNumber1, proteinNumber1)*100) /100
    const kcalPerProt2 = Math.round(calcProtKcal(kcalNumber2, proteinNumber2)*100) /100
   
    res.set("Content-Type", "text/html");
    res.write(`<h1>${food1.category.toString()}</h1>`)
    res.write(`<h2>${food1.food}</h2>`)
    res.write(`<p>${proteinNumber1} g protein</p>`)
    res.write(`<p>${kcalNumber1} kcal</p>`)
    res.write(`<p>${kcalPerProt1} kcal per 1g proteiinia</p>`)
    res.write(`<h1>${food2.category.toString()}</h1>`)
    res.write(`<h2>${food2.food}</h2>`)
    res.write(`<p>${proteinNumber2} g protein</p>`)
    res.write(`<p>${kcalNumber2} kcal</p>`)
    res.write(`<p>${kcalPerProt2} kcal per 1g proteiinia</p>`)
    res.send()
  } catch (errors) {
    console.error(errors);
  }
};
getFood()
})

function proteinNumberF(food) {
  const proteinCommaArray = /....(?=...Prote)/.exec(food.ingredients.toString())
  const proteinNumber = Number(proteinCommaArray[0].replace(/,/g, '.')) 
  return proteinNumber
}

function kcalNumberF(food) {
  const kcalCommaArray = /...(?=.kcal)/.exec(food.ingredients.toString())
  const kcalNumber = Number(kcalCommaArray[0])
  return kcalNumber

}

function calcProtKcal(kcalNumber, proteinNumber) {
const kcalPerProteinG =  kcalNumber / proteinNumber
return kcalPerProteinG
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})