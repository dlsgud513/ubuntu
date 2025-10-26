import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const initialMeals = [
  { id: 1, food_name: '사과', quantity: '1개', calories: 52, created_at: new Date().toISOString() },
  { id: 2, food_name: '닭가슴살', quantity: '100g', calories: 165, created_at: new Date().toISOString() },
];

const Dashboard = () => {
  const [meals, setMeals] = useState(initialMeals);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const sum = meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    setTotalCalories(sum);
  }, [meals]);

  const getCaloriesForFood = async (food) => {
    if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.warn('Gemini API 키가 .env 파일에 설정되지 않았습니다. 임시 딜레이 후 0을 반환합니다.');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 0;
    }

    setLoading(true);
    try {
      const prompt = `음식 '${food}'의 예상 칼로리(Kcal)를 다른 설명 없이 오직 숫자만으로 알려줘. 응답은 반드시 숫자만 포함해야 해.`;
      
      console.log('Gemini API 요청 프롬프트:', prompt);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      const data = await res.json();
      console.log('Gemini API 전체 응답:', data);

      if (!res.ok) {
        console.error('API 요청 실패:', data);
        throw new Error('API 요청 실패');
      }

      if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
        console.error('API 응답 형식이 예상과 다릅니다.', data);
        return 0;
      }

      const text = data.candidates[0].content.parts[0].text;
      console.log('API에서 추출된 텍스트:', text);

      const calories = parseInt(text.trim().replace(/[^0-9]/g, ''), 10);
      console.log('파싱된 칼로리:', calories);

      return isNaN(calories) ? 0 : calories;
    } catch (e) {
      console.error('칼로리 계산 중 오류 발생:', e);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!foodName || !quantity) {
      alert('음식 이름과 양을 모두 입력해주세요.');
      return;
    }

    const calories = await getCaloriesForFood(`${foodName} ${quantity}`);

    const newMeal = { food_name: foodName, quantity, calories };
    const newMealWithId = { ...newMeal, id: Date.now(), created_at: new Date().toISOString() };
    setMeals([...meals, newMealWithId]);

    setFoodName('');
    setQuantity('');
  };

  const handleDeleteMeal = async (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">식단 기록 대시보드</h1>

      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">오늘의 식단 추가</h2>
        <form onSubmit={handleAddMeal} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="음식 이름"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="양 (예: 1개, 100g)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 w-28">
            {loading ? '분석 중...' : '기록 추가'}
          </button>
        </form>
      </div>

      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">오늘의 식단 목록</h2>
          <div className="text-lg font-bold flex items-center gap-x-3">
            <span>총 칼로리: <span className="text-blue-600">{totalCalories}</span> Kcal</span>
            {loading && (
              <div className="w-28 h-6 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-blue-200 animate-pulse flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-700">계산 중...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <ul className="space-y-3">
          {meals.map(meal => (
            <li key={meal.id} className="flex justify-between items-center p-3 bg-gray-50/80 rounded-md">
              <div>
                <span className="font-medium">{meal.food_name}</span>
                <span className="text-gray-600 ml-2">({meal.quantity})</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-800 font-semibold mr-4">{meal.calories} Kcal</span>
                <button 
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="text-red-500 hover:text-red-700">
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
