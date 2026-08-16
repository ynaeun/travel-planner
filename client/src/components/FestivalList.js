import React, { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetch('https://travelplanner-i4kw.onrender.com/api/festivals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFestivals(data);
        } else {
          console.error('데이터가 배열이 아닙니다:', data);
          setFestivals([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('축제 데이터를 불러오는 중 오류 발생:', err);
        setError('데이터를 불러오지 못했습니다.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>List of domestic festivals</h2>
      {festivals.length === 0 ? (
        <p>표시할 축제가 없습니다.</p>
      ) : (
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', listStyle: 'none', padding: 0 }}>
          {festivals.map(festival => (
            <li key={festival.contentid} style={{ width: 220, border: '1px solid #ddd', borderRadius: 8, padding: 12, background: '#fafbff' }}>
              <Link to={`/festivals/${festival.contentid}`} state={{ festival, backgroundLocation: location }} style={{ textDecoration: 'none', color: 'inherit' }}>
                {festival.firstimage ? (
                  <img
                    src={festival.firstimage}
                    alt={festival.title}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: 120, background: '#eee', borderRadius: 6, marginBottom: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 14
                  }}>
                    이미지 없음
                  </div>
                )}
                <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{festival.title}</div>
                <div style={{ fontSize: 13, color: '#555' }}>
                  {festival.eventstartdate} ~ {festival.eventenddate}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FestivalList;
