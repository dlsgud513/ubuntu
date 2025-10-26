import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/chat';

const Dashboard = ({ meals, onAddMeal, onDeleteMeal, loading: isMealLoading }) => {
  // 식단 기록 상태
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  // 권장 칼로리 계산 상태
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recommendedCalories, setRecommendedCalories] = useState(null);
  const [isCalcLoading, setIsCalcLoading] = useState(false);

  useEffect(() => {
    const sum = meals.reduce((acc, meal) => acc + (meal.calories || 0), 0);
    setTotalCalories(sum);
  }, [meals]);

  const handleMealSubmit = (e) => {
    e.preventDefault();
    if (!foodName || !quantity) {
      alert('음식 이름과 양을 모두 입력해주세요.');
      return;
    }
    onAddMeal(foodName, quantity);
    setFoodName('');
    setQuantity('');
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      alert('나이, 키, 몸무게를 모두 입력해주세요.');
      return;
    }
    setIsCalcLoading(true);
    try {
      const prompt = `${age}세 ${gender === 'male' ? '남성' : '여성'}, 키 ${height}cm, 몸무게 ${weight}kg입니다. 주로 앉아서 생활하는 사무직일 경우, 하루 권장 섭취 칼로리는 얼마인가요? 다른 설명 없이 오직 숫자만으로 알려주세요.`;
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '백엔드 서버 요청 실패');
      const text = data.choices[0].message.content;
      const calories = parseInt(text.trim().replace(/[^0-9]/g, ''), 10);
      setRecommendedCalories(isNaN(calories) ? '계산 실패' : calories);
    } catch (error) {
      console.error('권장 칼로리 계산 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
    } finally {
      setIsCalcLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">식단 기록 대시보드</h1>

      {/* 식단 추가 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">오늘의 식단 추가</h2>
        <form onSubmit={handleMealSubmit} className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="음식 이름" value={foodName} onChange={(e) => setFoodName(e.target.value)} className="flex-grow p-2 border rounded-md" />
          <input type="text" placeholder="양 (예: 1개, 100g)" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="flex-grow p-2 border rounded-md" />
          <button type="submit" disabled={isMealLoading} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 w-28">
            {isMealLoading ? '분석 중...' : '기록 추가'}
          </button>
        </form>
      </div>

      {/* 식단 목록 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">오늘의 식단 목록</h2>
          <div className="text-lg font-bold flex items-center gap-x-3">
            <span>총 칼로리: <span className="text-blue-600">{totalCalories}</span> Kcal</span>
            {isMealLoading && (
              <div className="w-28 h-6 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-blue-200 animate-pulse flex items-center justify-center"><span className="text-xs font-semibold text-blue-700">계산 중...</span></div>
              </div>
            )}
          </div>
        </div>
        <ul className="space-y-3">
          {meals.map(meal => (
            <li key={meal.id} className="flex justify-between items-center p-3 bg-gray-50/80 rounded-md">
              <div><span className="font-medium">{meal.food_name}</span><span className="text-gray-600 ml-2">({meal.quantity})</span></div>
              <div className="flex items-center">
                <span className="text-gray-800 font-semibold mr-4">{meal.calories} Kcal</span>
                <button onClick={() => onDeleteMeal(meal.id)} className="text-red-500 hover:text-red-700">삭제</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 권장 칼로리 계산 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">하루 권장 칼로리 계산</h2>
        <form onSubmit={handleRecommendationSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">_label htmlFor="gender" className="text-sm font-medium mb-1">성별</label><select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 border rounded-md"><option value="male">남성</option><option value="female">여성</option></select></div>
          <div className="flex flex-col">_label htmlFor="age" className="text-sm font-medium mb-1">나이</label><input type="number" id="age" placeholder="세" value={age} onChange={(e) => setAge(e.target.value)} className="p-2 border rounded-md" /></div>
          <div className="flex flex-col">_label htmlFor="height" className="text-sm font-medium mb-1">키</label><input type="number" id="height" placeholder="cm" value={height} onChange={(e) => setHeight(e.target.value)} className="p-2 border rounded-md" /></div>
          <div className="flex flex-col">_label htmlFor="weight" className="text-sm font-medium mb-1">몸무게</label><input type="number" id="weight" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-2 border rounded-md" /></div>
          <button type="submit" disabled={isCalcLoading} className="col-span-2 sm:col-span-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400">
            {isCalcLoading ? '계산 중...' : 'AI에게 물어보기'}
          </button>
        </form>
        {recommendedCalories && (
          <div className="mt-4 text-center bg-green-100 p-3 rounded-lg">
            <p className="text-lg">회원님의 하루 권장 섭취 칼로리는 약 <span className="font-bold text-green-700">{recommendedCalories}</span> Kcal 입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;