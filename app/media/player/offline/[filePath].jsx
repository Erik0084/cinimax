import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import OfflineVideoPlayer from '@/components/business/player/OfflineVideoPlayer';

const OfflinePlayerScreen = () => {
  const params = useLocalSearchParams();
  
  // Decode the file path and other parameters
  const filePath = decodeURIComponent(params.filePath || '');
  const title = decodeURIComponent(params.title || 'Offline Video');
  const image = params.image ? decodeURIComponent(params.image) : null;

  return (
    <OfflineVideoPlayer 
      route={{
        params: {
          filePath,
          title,
          image
        }
      }}
    />
  );
};

export default OfflinePlayerScreen;