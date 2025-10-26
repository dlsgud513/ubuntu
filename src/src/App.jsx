import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RecipeBook from './pages/RecipeBook';
import RecipeSearch from './pages/RecipeSearch';

const BACKEND_URL = 'http://localhost:3001/api/chat';

// 초기 데이터
const initialMeals = [
  { id: 1, food_name: '사과', quantity: '1개', calories: 52, created_at: new Date().toISOString() },
  { id: 2, food_name: '닭가슴살', quantity: '100g', calories: 165, created_at: new Date().toISOString() },
];
const initialRecipes = [
  { id: 1, name: '김치찌개', ingredients: '김치, 돼지고기, 두부', instructions: '1. 돼지고기를 볶는다. 2. 김치를 넣고 더 볶는다. 3. 물을 붓고 끓인다.' },
  { id: 2, name: '계란말이', ingredients: '계란, 파, 당근', instructions: '1. 계란을 푼다. 2. 야채를 넣고 섞는다. 3. 팬에 부쳐 만다.' },
];

function App() {
  const [meals, setMeals] = useState(initialMeals);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [loading, setLoading] = useState(false);

  const getCaloriesForFood = async (food) => {
    setLoading(true);
    try {
      const prompt = `음식 '${food}'의 예상 칼로리(Kcal)를 다른 설명 없이 오직 숫자만으로 알려줘. 응답은 반드시 숫자만 포함해야 해.`;
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '백엔드 서버 요청 실패');
      const text = data.choices[0].message.content;
      const calories = parseInt(text.trim().replace(/[^0-9]/g, ''), 10);
      return isNaN(calories) ? 0 : calories;
    } catch (e) {
      console.error('칼로리 계산 중 오류 발생:', e);
      alert(`오류 발생: ${e.message}`);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (foodName, quantity) => {
    const calories = await getCaloriesForFood(`${foodName} ${quantity}`);
    const newMeal = { food_name: foodName, quantity, calories };
    const newMealWithId = { ...newMeal, id: Date.now(), created_at: new Date().toISOString() };
    setMeals([...meals, newMealWithId]);
  };

  const handleDeleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleAddRecipe = (name, ingredients, instructions) => {
    const newRecipe = { name, ingredients, instructions, id: Date.now() };
    setRecipes([...recipes, newRecipe]);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen w-full">
        <nav className="bg-gray-800/80 backdrop-blur-sm p-4 sticky top-0 z-10">
          <ul className="flex justify-center space-x-6">
            <li><Link to="/" className="text-white text-lg font-semibold hover:text-blue-300">대시보드</Link></li>
            <li><Link to="/recipes" className="text-white text-lg font-semibold hover:text-blue-300">레시피 북</Link></li>
            <li><Link to="/search" className="text-white text-lg font-semibold hover:text-blue-300">AI 레시피 검색</Link></li>
          </ul>
        </nav>

        <main className="p-4">
          <Routes>
            <Route path="/" element={<Dashboard meals={meals} onAddMeal={handleAddMeal} onDeleteMeal={handleDeleteMeal} loading={loading} />} />
            <Route path="/recipes" element={<RecipeBook recipes={recipes} onAddRecipe={handleAddRecipe} onDeleteRecipe={handleDeleteRecipe} />} />
            <Route path="/search" element={<RecipeSearch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
