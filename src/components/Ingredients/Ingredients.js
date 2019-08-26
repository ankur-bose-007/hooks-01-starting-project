import React, { useReducer , useEffect, useCallback, useMemo } from 'react';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import useHttp from '../../hooks/http';
const ingredientReducer=(currentIngredients,action)=>{
  switch(action.type){
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients,action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing=> ing.id!==action.id);
    default:
      throw new Error('Should not reach');
  }
}

const Ingredients = () => {
  const [userIngredients,dispatch]=useReducer(ingredientReducer,[]);
  const {isLoading,error,data,sendRequest,reqExtra,reqIdentifier,clear}=useHttp();
  useEffect(()=>{
    if(!isLoading && !error && reqIdentifier==='REMOVE_INGREDIENT'){
      dispatch({type:'DELETE',id:reqExtra});
    }else if(!isLoading && !error && reqIdentifier==='ADD_INGREDIENT'){
       dispatch({type:'ADD',ingredient:{
          id: data.name,
          ...reqExtra
        }});
    }
  },[data,reqExtra,reqIdentifier,isLoading,error]);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-update-22d06.firebaseio.com/ingredients.json'
    ,'POST'
    ,JSON.stringify(ingredient),ingredient,
    'ADD_INGREDIENT');
  },[sendRequest]);

  const filteredIngredientsHandler=useCallback(filteredIngredients=>{
    //setUserIngredients(filteredIngredients);
    dispatch({type:'SET',ingredients:filteredIngredients});
  },[]);

  const removeIngredientHandler = useCallback(ingId => {
    sendRequest(`https://react-hooks-update-22d06.firebaseio.com/ingredients/${ingId}.json`,
    'DELETE',
    null,
    ingId,
    'REMOVE_INGREDIENT'
    );
  },[sendRequest]);


  const ingredientList=useMemo(()=>{
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    );
  },[userIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
