import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const JellyfinPlayer = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const video = useRef(null);

  // Jellyfin configuration
  const JELLYFIN_CONFIG = {
    serverUrl: process.env.SERVER_URL,
    itemId: '5c5609109bd4f8b05a276c3e812d39dc',  
    apiKey: process.env.API_KEY, // Replace with your API key
    userId: '5c5609109bd4f8b05a276c3e812d39dc', // Replace with your user ID
  };

  useEffect(() => {
    const fetchJellyfinStream = async () => {
      try {
        const { serverUrl, itemId, apiKey, userId } = JELLYFIN_CONFIG;
        
        // Method 1: Try direct stream URL
        const directStreamUrl = `${serverUrl}/Videos/${itemId}/stream?static=true&api_key=${apiKey}`;

        console.log("directStreamUrl", directStreamUrl);
        
        // Method 2: Try transcoding URL (more compatible)
        const transcodingUrl = `${serverUrl}/Videos/${itemId}/main.m3u8?api_key=${apiKey}&playSessionId=${Date.now()}&mediaSourceId=${itemId}`;
        
        // Method 3: Try download URL
        const downloadUrl = `${serverUrl}/Items/${itemId}/Download?api_key=${apiKey}`;
        
        console.log('Trying direct stream URL:', directStreamUrl);
        
        // Test the URL first
        const response = await fetch(directStreamUrl, {  
          method: 'HEAD',
          headers: {
            'Authorization': `MediaBrowser Token="${apiKey}"`,
          }
        });
        
        if (response.ok) {
          setVideoUrl(directStreamUrl);
        } else {
          console.log('Direct stream failed, trying download URL');
          setVideoUrl(downloadUrl);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching video URL:', error);
        setLoading(false);
        
        // Fallback to test video
        const testUrl = 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4';
        setVideoUrl(testUrl);
        Alert.alert('Info', 'Using test video due to Jellyfin connection issues');
      }
    };

    fetchJellyfinStream();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      ) : videoUrl ? (
        <>
          <Video
            ref={video}
            style={styles.video}
            source={{ 
              uri: videoUrl,
              headers: {
                'User-Agent': 'ExpoApp/1.0.0',
              }
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={status => {
              setStatus(() => status);
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              }
              if (status.error) {
                console.error('Playback status error:', status.error);
              }
            }}
            shouldPlay={false}
            onError={(error) => {
              console.error('Video error details:', error);
              Alert.alert(
                'Playback Error', 
                `Failed to play video. Error: ${error.error || 'Unknown error'}\n\nThis might be due to:\n• Video format compatibility\n• Network issues\n• Authentication problems`
              );
            }}
            onLoad={(data) => {
              console.log('Video loaded successfully:', data);
            }}
            onLoadStart={() => {
              console.log('Video load started');
            }}
          />
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load video</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height * 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  playButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 25,
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JellyfinPlayer;
