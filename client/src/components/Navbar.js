import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav>
    <div className="nav-left">
      <Link to="/">Home</Link>
    </div>
    <div className="nav-center">
      <Link to="/festivals">Festival List</Link>
    </div>
    <div className="nav-right">
      <Link to="/planner">AI Planner</Link>
    </div>
  </nav>
);

export default Navbar;