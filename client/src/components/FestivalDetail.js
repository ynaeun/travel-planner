import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FestivalDetail.css';

const KAKAO_MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY;

const FestivalDetail = ({ isModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const baseFestival = location.state?.festival;
  const mapRef = useRef(null);
  const [festival, setFestival] = useState(baseFestival);

  useEffect(() => {
    if (!baseFestival?.contentid) return;

    fetch(`https://travelplanner-i4kw.onrender.com/api/festival-detail?contentId=${baseFestival.contentid}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data) {
          setFestival(prev => ({ ...prev, ...data }));
        }
      })
      .catch(error => {
        console.error("Failed to fetch festival detail:", error);
      });
  }, [baseFestival]);

  useEffect(() => {
    if (!festival?.mapy || !festival?.mapx) return;

    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = mapRef.current;
        const mapOption = {
          center: new window.kakao.maps.LatLng(Number(festival.mapy), Number(festival.mapx)),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(Number(festival.mapy), Number(festival.mapx)),
        });
      });
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = loadKakaoMap;

      return () => {
        document.head.removeChild(script);
      };
    } else {
      loadKakaoMap();
    }
  }, [festival]);

  if (!festival) return <div>축제 정보를 찾을 수 없습니다.</div>;

  const handlePlan = () => {
    navigate('/planner', { state: { festival } });
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={isModal ? "festival-detail-modal" : "festival-detail-container"}>
      {isModal && (
        <button className="festival-detail-modal-close" onClick={handleClose} aria-label="닫기">
          &times;
        </button>
      )}
      <div className="festival-detail-modal-content">
        <div className="festival-detail-modal-left">
          <div className="festival-detail-modal-title">{festival.title || '제목 없음'}</div>

          <div className="festival-detail-modal-info">
            <div>
              기간: {festival.eventstartdate || baseFestival.eventstartdate} ~ {festival.eventenddate || baseFestival.eventenddate}
            </div>
            <div>장소: {festival.addr1 || '주소 정보 없음'}</div>
          </div><br />

          <button className="festival-detail-plan-btn" onClick={handlePlan}>
            Create a schedule with this festival
          </button>
        </div>

        <div className="festival-detail-modal-right">
          {festival.firstimage && (
            <img
              src={festival.firstimage}
              alt={festival.title || '축제 이미지'}
              className="festival-detail-modal-image"
            />
          )}
          <div
            ref={mapRef}
            id="map"
            className="festival-detail-modal-map"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetail;
