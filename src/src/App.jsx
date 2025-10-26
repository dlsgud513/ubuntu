import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RecipeBook from './pages/RecipeBook';
import RecipeSearch from './pages/RecipeSearch';

function App() {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-white">대시보드</Link>
            </li>
            <li>
              <Link to="/recipes" className="text-white">레시피 북</Link>
            </li>
            <li>
              <Link to="/search" className="text-white">레시피 검색</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes" element={<RecipeBook />} />
          <Route path="/search" element={<RecipeSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;