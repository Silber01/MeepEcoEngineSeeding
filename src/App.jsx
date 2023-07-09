import { useState } from "react";
import "./App.css";
import getItems from "./items";
import getWork from "./work";
import { useEffect } from "react";

function App() {
  const items = getItems();
  const [focusedRecipe, setFocusedRecipe] = useState(0);
  const [recipes, setRecipes] = useState([
    {
      ITEMS: [
        {
          ITEM: "",
          QUANTITY: null,
        },
      ],
      WORK: "",
    },
  ]);

  useEffect(() => {
    if (recipes.length - 1 >= focusedRecipe) {
      // console.log("RECIPE CHANGED:");
      // console.log(recipes);
      let recipesCopy = JSON.parse(JSON.stringify(recipes));
      let lastIndex = recipesCopy[focusedRecipe]["ITEMS"].length - 1;
      if (recipesCopy[focusedRecipe]["ITEMS"][lastIndex]["ITEM"] != "") {
        recipesCopy[focusedRecipe]["ITEMS"].push({
          ITEM: "",
          QUANTITY: null,
        });
        setRecipes(recipesCopy);
      }
    }
  }, [recipes]);

  function filterRecipes() {
    const itemSet = new Set(getItems());
    const workSet = new Set(getWork());
    let filtered = [];

    let recipesCopy = recipes.filter((recipe) => {
      return recipe["ITEMS"].length > 1 || recipe["WORK"] != "";
    }); //removes elements with size 0 or 1 (an element with size 1 is guaranteed to be empty)
    recipesCopy.forEach((recipe, recipeIndex) => {
      let isValid = true;
      let validItems = [];
      recipe["ITEMS"].forEach((item, itemIndex) => {
        if (item["ITEM"] == "") {
          return;
        } else if (!itemSet.has(item["ITEM"])) {
          isValid = false;
          console.log("WARNING: " + item["ITEM"] + " is not a valid item");
          return;
        } else if (item["QUANTITY"] == null || item["QUANTITY"] <= 0) {
          isValid = false;
          console.log(
            "WARNING: " + item["ITEM"] + " does not have an assigned quantity"
          );
          return;
        } else {
          validItems.push(item);
        }
      });
      if (!workSet.has(recipe["WORK"])) {
        isValid = false;
        console.log("WARNING: " + recipe["WORK"] + " is not a valid work");
        return;
      }
      if (isValid) {
        filtered.push({
          ITEMS: validItems,
          WORK: recipe["WORK"],
        });
      }
    });

    console.log(JSON.stringify(filtered));
    return filtered;
  }

  function addRecipe() {
    let recipesCopy = JSON.parse(JSON.stringify(recipes));
    recipesCopy.push({
      ITEMS: [
        {
          ITEM: "",
          QUANTITY: null,
        },
      ],
      WORK: "",
    });
    setRecipes(recipesCopy);
  }

  function deleteRecipe(recipeIndex) {
    setFocusedRecipe(0);
    let recipesCopy = JSON.parse(JSON.stringify(recipes));
    recipesCopy.splice(recipeIndex, 1);
    setRecipes(recipesCopy);
    setFocusedRecipe(0);
  }

  function editRecipe(recipeIndex, itemIndex, editType, newVal) {
    let recipesCopy = JSON.parse(JSON.stringify(recipes));
    if (editType == "WORK") {
      recipesCopy[recipeIndex]["WORK"] = newVal;
    } else {
      recipesCopy[recipeIndex]["ITEMS"][itemIndex][editType] = newVal;
    }
    setRecipes(recipesCopy);
  }

  function deleteItem(recipeIndex, itemIndex) {
    let recipesCopy = JSON.parse(JSON.stringify(recipes));
    recipesCopy[recipeIndex]["ITEMS"].splice(itemIndex, 1);
    setRecipes(recipesCopy);
  }

  return (
    <>
      <h1>MeepEcoEngine</h1>
      <label>
        Item:
        <input list="items" name="items" />
      </label>
      <datalist id="items">
        {items.map((i) => {
          return <option>{i}</option>;
        })}
      </datalist>
      <br></br>
      <h3>Recipes:</h3>
      {recipes.map((recipe, recipeIndex) => {
        return (
          <>
            <h3>
              Recipe #{recipeIndex + 1}{" "}
              <button
                onClick={() => {
                  deleteRecipe(recipeIndex);
                }}
              >
                Remove
              </button>
            </h3>
            {recipe["ITEMS"].map((item, itemIndex) => {
              return (
                <>
                  <label>
                    Item:
                    <input
                      list="items"
                      name="items"
                      defaultValue={item["ITEM"]}
                      onFocus={() => {
                        setFocusedRecipe(recipeIndex);
                      }}
                      onBlur={() => {
                        if (
                          item["ITEM"] == "" &&
                          itemIndex != recipe["ITEMS"].length - 1
                        ) {
                          deleteItem(recipeIndex, itemIndex);
                        }
                      }}
                      onChange={(event) => {
                        editRecipe(
                          recipeIndex,
                          itemIndex,
                          "ITEM",
                          event.target.value
                        );
                      }}
                    />
                  </label>
                  <datalist id="items">
                    {items.map((i) => {
                      return <option>{i}</option>;
                    })}
                  </datalist>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      defaultValue={item["QUANTITY"]}
                      onChange={(event) => {
                        editRecipe(
                          recipeIndex,
                          itemIndex,
                          "QUANTITY",
                          Number(event.target.value)
                        );
                      }}
                    />
                  </label>
                  <br></br>
                </>
              );
            })}
            <label>
              Work:
              <input
                list="work"
                name="work"
                onChange={(event) => {
                  editRecipe(recipeIndex, -1, "WORK", event.target.value);
                }}
              />
            </label>
            <datalist id="work">
              {getWork().map((i) => {
                return <option>{i}</option>;
              })}
            </datalist>
            <br></br>
          </>
        );
      })}
      <button
        onClick={() => {
          addRecipe();
        }}
      >
        Add Recipe
      </button>
      <button
        onClick={() => {
          filterRecipes();
        }}
      >
        Save
      </button>
    </>
  );
}

export default App;
