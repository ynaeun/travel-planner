require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Google Gemini 연동용 라이브러리
const { GoogleGenerativeAI } = require('@google/generative-ai'); // ← 올바른 모듈명



const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/festivals', async (req, res) => {
  try {
    const response = await axios.get('http://apis.data.go.kr/B551011/EngService1/searchFestival1', {
      params: {
        ServiceKey: process.env.TOUR_API_KEY ,
        eventStartDate: '20250601',
        eventEndDate: '20281231',
        areaCode: '',
        sigunguCode: '',
        listYN: 'Y',
        MobileOS: 'ETC',
        MobileApp: 'TravelPlanner',
        arrange: 'A',
        numOfRows: 1000,
        pageNo: 1,
        _type: 'json',
      }
    });

    const items = response.data?.response?.body?.items?.item;
    const festivals = Array.isArray(items) ? items : (items ? [items] : []);
    res.json(festivals);

  } catch (error) {
    console.error('축제 목록 API 오류:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    res.status(500).json({ error: '축제 데이터를 가져오는 데 실패했습니다.' });
  }
});


/**
 * [2] 축제 상세 정보 조회 (개별 contentId 기준)
 */
app.get('/api/festival-detail', async (req, res) => {
  const { contentId } = req.query;
  console.log('백엔드에서 받은 contentId:', contentId); 

  if (!contentId) {
    return res.status(400).json({ error: 'contentId는 필수입니다.' });
  }

  try {
    const response = await axios.get('http://apis.data.go.kr/B551011/EngService1/detailCommon1', {
      params: {
        ServiceKey: process.env.TOUR_API_KEY,
        contentTypeId: 85,
        contentId: Number(contentId),
        MobileOS: 'ETC',
        MobileApp: 'TravelPlanner',
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        catcodeYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y',
        transGuideYN: 'Y'
      }
    });

    const detail = response.data?.response?.body?.items?.item;
    if (!detail) {
      return res.status(404).json({ error: '축제 상세 정보를 찾을 수 없습니다.' });
    }

    res.json(detail);
  } catch (error) {
    console.error(`상세 정보 API 오류 (contentId: ${contentId}):`, error.message);
    res.status(500).json({ error: '상세 정보를 가져오는 데 실패했습니다.' });
  }
});
// Gemini LLM 프록시 (GoogleGenAI 사용)
app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
    

    const result = await model.generateContent(prompt);
    const aiMessage = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI 응답이 없습니다.';
    res.json({ message: aiMessage });
  } catch (error) {
      console.error('Gemini 오류:', error);
    res.status(500).json({ message: 'Gemini API 호출 실패', error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
