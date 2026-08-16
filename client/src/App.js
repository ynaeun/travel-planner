import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FestivalList from './components/FestivalList';
import FestivalDetail from './components/FestivalDetail';
import TravelPlanner from './components/TravelPlanner';

function AppRoutes() {
  const location = useLocation();
  // background location이 있으면 모달로 띄움
  const state = location.state || {};
  const background = state && state.backgroundLocation;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/festivals" element={<FestivalList />} />
        <Route path="/festivals/:id" element={<FestivalDetail />} />
        <Route path="/planner" element={<TravelPlanner />} />
      </Routes>
      {/* background가 있으면 모달로 FestivalDetail 렌더 */}
      {background && (
        <Routes>
          <Route path="/festivals/:id" element={<FestivalDetail isModal />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
    </Router>
  );
}

export default App;