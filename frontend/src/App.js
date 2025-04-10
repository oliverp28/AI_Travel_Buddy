import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import TravelPlan from './pages/TravelPlan';
import Inspiration from './pages/Inspiration';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/travel-plan" element={<TravelPlan />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
