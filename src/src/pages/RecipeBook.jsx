import React, { useState } from 'react';

const RecipeBook = ({ recipes, onAddRecipe, onDeleteRecipe }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !ingredients || !instructions) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    onAddRecipe(name, ingredients, instructions);
    setName('');
    setIngredients('');
    setInstructions('');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">개인 레시피 북</h1>

      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">새 레시피 추가</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div key={recipe.id} className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-2"><span className="font-semibold">재료:</span> {recipe.ingredients}</p>
            <p className="text-gray-600 flex-grow"><span className="font-semibold">조리법:</span> {recipe.instructions}</p>
            <button 
              onClick={() => onDeleteRecipe(recipe.id)}
              className="text-red-500 hover:text-red-700 self-end mt-4">
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeBook;
