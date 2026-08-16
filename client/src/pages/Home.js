import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
return(
  <main style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center'
  }}>
    <h1>Travel-Planner</h1>
    <p>Plan your trip around Korea’s local festivals with AI!</p>
    <button
        onClick={() => navigate('/festivals')}
        style={{
          marginTop: '2rem',
          padding: '0.8rem 2rem',
          fontSize: '1.1rem',
          background: '#3b5998',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >        Get Started
</button>
  </main>
);
}

export default Home;