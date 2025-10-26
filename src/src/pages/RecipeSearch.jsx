import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const BACKEND_URL = 'http://localhost:3001/api/chat';

const RecipeSearch = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendation = async () => {
    if (!prompt) {
      alert('요청 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const fullPrompt = `당신은 전문 영양사입니다. 다음 요청에 따라 레시피를 추천하고, 결과는 한국어로 제공해 주세요. 각 레시피는 제목, 주요 재료, 간단 조리법을 포함해야 합니다. 결과를 깔끔한 마크다운 형식으로 작성해주세요.\n\n[사용자 요청]:\n${prompt}`;

      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '백엔드 서버 요청 실패');
      }

      const text = data.choices[0].message.content;
      setResponse(text);

    } catch (e) {
      setError(e.message);
      console.error('Error getting recommendation:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI 레시피 검색/추천</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">레시피 추천 요청</h2>
        <p className="text-gray-600 mb-4">부족한 영양소를 보충하거나, 특정 목표(예: 고단백 저칼로리)에 맞는 레시피를 AI에게 요청해보세요.</p>
        <div className="flex flex-col gap-4">
          <textarea
            placeholder="예: 오늘 점심에 김치찌개를 먹었는데, 저녁은 나트륨이 적고 단백질이 풍부한 식단으로 추천해줘."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="p-2 border rounded-md h-28"
          />
          <button 
            onClick={getRecommendation}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 self-start">
            {loading ? '추천받는 중...' : 'AI 추천 받기'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

      {response && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AI 추천 결과</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
