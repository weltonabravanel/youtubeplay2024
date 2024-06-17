import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Main from '../components/section/Main';
import VideoView from '../components/video/VideoView';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [programmingVideos, setProgrammingVideos] = useState([]);

  const latestMusicCacheKey = 'latestMusicVideos';
  const latestMusicCacheTimeKey = 'latestMusicCacheTime';
  const programmingCacheKey = 'programmingVideos';
  const programmingCacheTimeKey = 'programmingCacheTime';
  const cacheDuration = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const cachedVideos = localStorage.getItem(latestMusicCacheKey);
    const cachedTime = localStorage.getItem(latestMusicCacheTimeKey);
    const cachedProgrammingVideos = localStorage.getItem(programmingCacheKey);
    const cachedProgrammingTime = localStorage.getItem(programmingCacheTimeKey);

    if (cachedVideos && cachedTime && (Date.now() - parseInt(cachedTime) < cacheDuration)) {
      setVideos(JSON.parse(cachedVideos));
    } else {
      fetchLatestMusicVideos();
    }

    if (cachedProgrammingVideos && cachedProgrammingTime && (Date.now() - parseInt(cachedProgrammingTime) < cacheDuration)) {
      setProgrammingVideos(JSON.parse(cachedProgrammingVideos));
    } else {
      fetchProgrammingVideos();
    }
  }, [cacheDuration]);

  const fetchLatestMusicVideos = async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const formattedDate = oneMonthAgo.toISOString();

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 4,
          q: 'ASMR Coding',
          type: 'video',
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          publishedAfter: formattedDate,
        },
      });
      const videos = response.data.items;
      setVideos(videos);

      localStorage.setItem(latestMusicCacheKey, JSON.stringify(videos));
      localStorage.setItem(latestMusicCacheTimeKey, Date.now().toString());
    } catch (error) {
      console.error('Error fetching latest music videos:', error);
    }
  };

  const fetchProgrammingVideos = async () => {
    const formattedDate = new Date().toISOString(); // 현재 시간 기준으로 검색

    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 4,
          q: 'React Programming',
          type: 'video',
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          publishedAfter: formattedDate,
        },
      });
      const programmingVideos = response.data.items;
      setProgrammingVideos(programmingVideos);

      localStorage.setItem(programmingCacheKey, JSON.stringify(programmingVideos));
      localStorage.setItem(programmingCacheTimeKey, Date.now().toString());
    } catch (error) {
      console.error('Error fetching programming videos:', error);
    }
  };

  return (
    <Main title="Coding YouTube" description="모든 coding을 모아둔 채널입니다.">
        <div className='main__info'>
            <h1>추천영상</h1>
            <p>ASMR YouTube</p>
            <VideoView videos={videos} /> 
        </div>
        <div className="main__sub">
            <h1>Programming</h1>
            <p>React Programming</p>
            <VideoView videos={programmingVideos} /> 
        </div>
    </Main>
  );
};

export default Home;
