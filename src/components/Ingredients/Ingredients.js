import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';


const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  /*useEffect(()=>{
    console.log("Rendering component",userIngredients);
  },[userIngredients]);*/

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-22d06.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-type': 'application/json' }
    }).then(response => {
      return response.json()
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        {
          id: responseData.name,
          ...ingredient
        }
      ]);
    });

  }

  const filteredIngredientsHandler=useCallback(filteredIngredients=>{
    setUserIngredients(filteredIngredients);
  },[]);

  const removeIngredientHandler = ingId => {
    fetch(`https://react-hooks-update-22d06.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE'
    }).then(response=>
    setUserIngredients(prevIngredients => {
      const updatedIngredients = prevIngredients.filter(ingredient => {
        return ingredient.id !== ingId;
      })
      return [...updatedIngredients];
    }))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
