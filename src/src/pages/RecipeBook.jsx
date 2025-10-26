import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient'; // Supabase 설정이 완료되면 주석 해제

// 임시 데이터
const initialRecipes = [
  { id: 1, name: '김치찌개', ingredients: '김치, 돼지고기, 두부', instructions: '1. 돼지고기를 볶는다. 2. 김치를 넣고 더 볶는다. 3. 물을 붓고 끓인다.' },
  { id: 2, name: '계란말이', ingredients: '계란, 파, 당근', instructions: '1. 계란을 푼다. 2. 야채를 넣고 섞는다. 3. 팬에 부쳐 만다.' },
];

const RecipeBook = () => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  // useEffect(() => {
  //   fetchRecipes(); // Supabase 연동 후 실제 데이터 로드
  // }, []);

  // const fetchRecipes = async () => {
  //   const { data, error } = await supabase.from('recipes').select('*');
  //   if (error) console.error('Error fetching recipes:', error);
  //   else setRecipes(data);
  // };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!name || !ingredients || !instructions) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    const newRecipe = { name, ingredients, instructions };

    // Supabase 연동 후 아래 코드로 교체
    const newRecipeWithId = { ...newRecipe, id: recipes.length + 1 };
    setRecipes([...recipes, newRecipeWithId]);

    // const { data, error } = await supabase.from('recipes').insert([newRecipe]).select();
    // if (error) {
    //   console.error('Error adding recipe:', error);
    // } else if (data) {
    //   setRecipes([...recipes, data[0]]);
    // }

    setName('');
    setIngredients('');
    setInstructions('');
  };

  const handleDeleteRecipe = async (id) => {
    // Supabase 연동 후 아래 코드로 교체
    setRecipes(recipes.filter(recipe => recipe.id !== id));

    // const { error } = await supabase.from('recipes').delete().eq('id', id);
    // if (error) console.error('Error deleting recipe:', error);
    // else setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">개인 레시피 북</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">새 레시피 추가</h2>
        <form onSubmit={handleAddRecipe} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="레시피 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="주요 재료 (쉼표로 구분)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="p-2 border rounded-md"
          />
          <textarea
            placeholder="간단 조리법"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="p-2 border rounded-md h-24"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-start">
            레시피 추가
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-2"><span className="font-semibold">재료:</span> {recipe.ingredients}</p>
            <p className="text-gray-600 flex-grow"><span className="font-semibold">조리법:</span> {recipe.instructions}</p>
            <button 
              onClick={() => handleDeleteRecipe(recipe.id)}
              className="text-red-500 hover:text-red-700 self-end mt-4">
              삭제
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default RecipeBook;