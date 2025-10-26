import React, { useState, useEffect } from 'react';

const Dashboard = ({ meals, onAddMeal, onDeleteMeal, loading }) => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const sum = meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    setTotalCalories(sum);
  }, [meals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !quantity) {
      alert('음식 이름과 양을 모두 입력해주세요.');
      return;
    }
    onAddMeal(foodName, quantity);
    setFoodName('');
    setQuantity('');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">식단 기록 대시보드</h1>

      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">오늘의 식단 추가</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
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
                  onClick={() => onDeleteMeal(meal.id)}
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
