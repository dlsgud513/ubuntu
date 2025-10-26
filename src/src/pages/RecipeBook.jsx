import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const BACKEND_URL = 'http://localhost:3001/api/chat';

const RecipeBook = ({ recipes, onAddRecipe, onDeleteRecipe }) => {
  // 내 레시피 관리 상태
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  // AI 추천 관리 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMyRecipeSubmit = (e) => {
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

  const handleRecommendationRequest = async () => {
    if (!searchQuery) {
      alert('추천받고 싶은 레시피 이름을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setRecommendations('');
    try {
      const prompt = `'${searchQuery}'와 비슷하거나, 이 요리를 좋아하는 사람이 좋아할 만한 다른 레시피 3가지를 추천해줘. 각 레시피는 **제목, 이 레시피의 장점, 주요 재료, 간단 조리법**을 반드시 포함해야 하고, 전체 답변은 한국어로, 깔끔한 마크다운 형식으로 작성해줘.`;
      const res = await fetch(BACKEND_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '백엔드 서버 요청 실패');
      setRecommendations(data.choices[0].message.content);
    } catch (error) {
      console.error('AI 추천 중 오류:', error);
      alert(`오류 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">개인 레시피 북</h1>

      {/* AI 유사 레시피 추천 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">AI 유사 레시피 추천받기</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="레시피 이름 입력 (예: 김치찌개)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <button onClick={handleRecommendationRequest} disabled={isLoading} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 disabled:bg-gray-400">
            {isLoading ? '추천받는 중...' : 'AI 추천받기'}
          </button>
        </div>
        {recommendations && (
          <div className="mt-4 border-t pt-4">
             <div className="prose max-w-none"><ReactMarkdown>{recommendations}</ReactMarkdown></div>
          </div>
        )}
      </div>

      {/* 내 레시피 추가 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">새 레시피 추가</h2>
        <form onSubmit={handleMyRecipeSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="레시피 이름" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded-md" />
          <input type="text" placeholder="주요 재료 (쉼표로 구분)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="p-2 border rounded-md" />
          <textarea placeholder="간단 조리법" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="p-2 border rounded-md h-24" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 self-start">레시피 추가</button>
        </form>
      </div>

      {/* 내 레시피 목록 */}
      <h2 className="text-2xl font-bold mb-4 text-white">내 레시피 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
            <p className="text-gray-600 mb-2"><span className="font-semibold">재료:</span> {recipe.ingredients}</p>
            <p className="text-gray-600 flex-grow"><span className="font-semibold">조리법:</span> {recipe.instructions}</p>
            <button onClick={() => onDeleteRecipe(recipe.id)} className="text-red-500 hover:text-red-700 self-end mt-4">삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeBook;