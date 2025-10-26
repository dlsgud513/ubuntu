import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabaseClient'; // Supabase 설정이 완료되면 주석 해제

// 임시 데이터
const initialMeals = [
  { id: 1, food_name: '사과', quantity: '1개', created_at: new Date().toISOString() },
  { id: 2, food_name: '닭가슴살', quantity: '100g', created_at: new Date().toISOString() },
];

const Dashboard = () => {
  const [meals, setMeals] = useState(initialMeals);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');

  // useEffect(() => {
  //   fetchMeals(); // Supabase 연동 후 실제 데이터 로드
  // }, []);

  // const fetchMeals = async () => {
  //   const { data, error } = await supabase.from('meals').select('*');
  //   if (error) console.error('Error fetching meals:', error);
  //   else setMeals(data);
  // };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!foodName || !quantity) {
      alert('음식 이름과 양을 모두 입력해주세요.');
      return;
    }
    const newMeal = { food_name: foodName, quantity };
    
    // Supabase 연동 후 아래 코드로 교체
    const newMealWithId = { ...newMeal, id: meals.length + 1, created_at: new Date().toISOString() };
    setMeals([...meals, newMealWithId]);

    // const { data, error } = await supabase.from('meals').insert([newMeal]).select();
    // if (error) {
    //   console.error('Error adding meal:', error);
    // } else if (data) {
    //   setMeals([...meals, data[0]]);
    // }

    setFoodName('');
    setQuantity('');
  };

  const handleDeleteMeal = async (id) => {
    // Supabase 연동 후 아래 코드로 교체
    setMeals(meals.filter(meal => meal.id !== id));

    // const { error } = await supabase.from('meals').delete().eq('id', id);
    // if (error) console.error('Error deleting meal:', error);
    // else setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">식단 기록 대시보드</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            기록 추가
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">오늘의 식단 목록</h2>
        <ul className="space-y-3">
          {meals.map(meal => (
            <li key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <span className="font-medium">{meal.food_name}</span>
                <span className="text-gray-600 ml-2">({meal.quantity})</span>
              </div>
              <button 
                onClick={() => handleDeleteMeal(meal.id)}
                className="text-red-500 hover:text-red-700">
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;