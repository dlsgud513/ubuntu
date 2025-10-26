import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/chat';

const CalorieSummary = ({ recommended, consumed }) => {
  const percentage = recommended > 0 ? (consumed / recommended) * 100 : 0;
  const remaining = recommended > 0 ? recommended - consumed : 0;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-center">오늘의 칼로리 요약</h2>
      <div className="flex justify-center items-center my-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} strokeWidth="10" className="text-gray-200" fill="transparent" stroke="currentColor" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="10"
            className="text-blue-500"
            fill="transparent"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-xl font-bold fill-current text-gray-700 transform rotate-90 origin-center">{Math.round(percentage)}%</text>
        </svg>
      </div>
      <div className="text-center space-y-2">
        <div>
          <p className="text-sm text-gray-500">권장 칼로리</p>
          <p className="text-lg font-bold">{recommended > 0 ? `${recommended} Kcal` : '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">현재 섭취량</p>
          <p className="text-lg font-bold text-blue-600">{consumed} Kcal</p>
        </div>
        <hr className="my-2"/>
        <div>
          <p className="text-sm text-gray-500">남은 칼로리</p>
          <p className="text-xl font-bold text-green-600">{recommended > 0 ? `${remaining} Kcal` : '-'}</p>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ meals, onAddMeal, onDeleteMeal, loading: isMealLoading }) => {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recommendedCalories, setRecommendedCalories] = useState(0);
  const [recommendedWater, setRecommendedWater] = useState(0);
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
      const caloriePrompt = `${age}세 ${gender === 'male' ? '남성' : '여성'}, 키 ${height}cm, 몸무게 ${weight}kg입니다. 주로 앉아서 생활하는 사무직일 경우, 하루 권장 섭취 칼로리는 얼마인가요? 다른 설명 없이 오직 숫자만으로 알려주세요.`;
      const waterPrompt = `${age}세 ${gender === 'male' ? '남성' : '여성'}, 키 ${height}cm, 몸무게 ${weight}kg입니다. 하루 권장 수분 섭취량은 몇 리터(L)인가요? 다른 설명 없이 오직 숫자만으로 알려주세요.`;

      // Promise.all로 두 요청을 동시에 보냅니다.
      const [calorieRes, waterRes] = await Promise.all([
        fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: caloriePrompt }) }),
        fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: waterPrompt }) })
      ]);

      const calorieData = await calorieRes.json();
      if (!calorieRes.ok) throw new Error(calorieData.error || '칼로리 계산 실패');
      const calorieText = calorieData.choices[0].message.content;
      const calories = parseInt(calorieText.trim().replace(/[^0-9]/g, ''), 10);
      setRecommendedCalories(isNaN(calories) ? 0 : calories);

      const waterData = await waterRes.json();
      if (!waterRes.ok) throw new Error(waterData.error || '수분 섭취량 계산 실패');
      const waterText = waterData.choices[0].message.content;
      const water = parseFloat(waterText.trim().replace(/[^0-9.]/g, ''));
      setRecommendedWater(isNaN(water) ? 0 : water);

    } catch (error) {
      console.error('계산 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
      setRecommendedCalories(0);
      setRecommendedWater(0);
    } finally {
      setIsCalcLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* 식단 추가 섹션 */}
        <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6">
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
        <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">오늘의 식단 목록</h2>
            {isMealLoading && (
              <div className="w-28 h-6 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-blue-200 animate-pulse flex items-center justify-center"><span className="text-xs font-semibold text-blue-700">계산 중...</span></div>
              </div>
            )}
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

        {/* 정보 입력 섹션 (칼로리 및 수분 계산용) */}
        <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">내 정보 입력 (AI 분석용)</h2>
          <form onSubmit={handleRecommendationSubmit} className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col"><label htmlFor="gender" className="text-sm font-medium mb-1">성별</label><select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 border rounded-md"><option value="male">남성</option><option value="female">여성</option></select></div>
            <div className="flex flex-col"><label htmlFor="age" className="text-sm font-medium mb-1">나이</label><input type="number" id="age" placeholder="세" value={age} onChange={(e) => setAge(e.target.value)} className="p-2 border rounded-md" /></div>
            <div className="flex flex-col"><label htmlFor="height" className="text-sm font-medium mb-1">키</label><input type="number" id="height" placeholder="cm" value={height} onChange={(e) => setHeight(e.target.value)} className="p-2 border rounded-md" /></div>
            <div className="flex flex-col"><label htmlFor="weight" className="text-sm font-medium mb-1">몸무게</label><input type="number" id="weight" placeholder="kg" value={weight} onChange={(e) => setWeight(e.target.value)} className="p-2 border rounded-md" /></div>
            <button type="submit" disabled={isCalcLoading} className="col-span-2 sm:col-span-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400">
              {isCalcLoading ? '계산 중...' : '권장량 계산하기'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <CalorieSummary recommended={recommendedCalories} consumed={totalCalories} />
        <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 sticky top-24">
          <h2 className="text-xl font-semibold mb-4 text-center">오늘의 수분 목표</h2>
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-600">{recommendedWater > 0 ? `${recommendedWater} L` : '- L'}</p>
            <p className="text-sm text-gray-500 mt-2">하루 권장 섭취량</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
