import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Player = ({ id }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [screenData, setScreenData] = useState(Dimensions.get("window"));
  const video = useRef(null);

  // Jellyfin configuration
  const JELLYFIN_CONFIG = {
    serverUrl: "http://192.168.1.13:8096",
    itemId: id,
    apiKey: "4a8f78d0e0eb4b7f8957732ee343a3b0",
    userId: "ee199cb3177a4b4fa1ffe22d10f9857e",
  };

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenData(window);
      const isLandscape = window.width > window.height;
      setOrientation(isLandscape ? "landscape" : "portrait");
    });

    return () => subscription?.remove();
  }, []);

  // Reset screen orientation when component unmounts
  useEffect(() => {
    return () => {
      // Reset to portrait orientation when exiting player
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        .then(() => {
          StatusBar.setHidden(false);
        })
        .catch((error) => {
          console.log("Error resetting orientation:", error);
        });
    };
  }, []);  

  // Enhanced Jellyfin stream fetching
  useEffect(() => {
    const fetchJellyfinStream = async () => {
      try {
        const { serverUrl, itemId, apiKey, userId } = JELLYFIN_CONFIG;

        // Get media info
        const mediaResponse = await fetch(
          `${serverUrl}/Users/${userId}/Items/${itemId}?api_key=${apiKey}`,
          {
            headers: {
              Authorization: `MediaBrowser Token="${apiKey}"`,
            },
          }
        );

        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          setMediaInfo(mediaData);
        }

        // Get playback info for optimal streaming
        const playbackInfoResponse = await fetch(
          `${serverUrl}/Items/${itemId}/PlaybackInfo?api_key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `MediaBrowser Token="${apiKey}"`,
            },
            body: JSON.stringify({
              UserId: userId,
              MaxStreamingBitrate: 120000000,
              StartTimeTicks: 0,
              DeviceProfile: {
                MaxStreamingBitrate: 120000000,
                MaxStaticBitrate: 100000000,
                MusicStreamingTranscodingBitrate: 384000,
                DirectPlayProfiles: [
                  {
                    Container: "mp4,m4v,mkv,avi",
                    Type: "Video",
                    VideoCodec: "h264,h265,hevc",
                    AudioCodec: "aac,mp3,ac3",
                  },
                ],
                TranscodingProfiles: [
                  {
                    Container: "ts",
                    Type: "Video",
                    VideoCodec: "h264",
                    AudioCodec: "aac",
                    Context: "Streaming",
                    Protocol: "hls",
                  },
                ],
              },
            }),
          }
        );

        if (playbackInfoResponse.ok) {
          const playbackData = await playbackInfoResponse.json();

          if (
            playbackData.MediaSources &&
            playbackData.MediaSources.length > 0
          ) {
            const mediaSource = playbackData.MediaSources[0];

            let streamUrl;
            if (mediaSource.SupportsDirectStream) {
              streamUrl = `${serverUrl}/Videos/${itemId}/stream?static=true&mediaSourceId=${mediaSource.Id}&api_key=${apiKey}`;
            } else if (mediaSource.TranscodingUrl) {
              streamUrl = `${serverUrl}${mediaSource.TranscodingUrl}`;
            } else {
              // Fallback to HLS transcoding
              streamUrl = `${serverUrl}/Videos/${itemId}/master.m3u8?api_key=${apiKey}&mediaSourceId=${mediaSource.Id}`;
            }

            setVideoUrl(streamUrl);
          }
        } else {
          // Fallback to direct stream
          const directStreamUrl = `${serverUrl}/Videos/${itemId}/stream?static=true&api_key=${apiKey}`;
          setVideoUrl(directStreamUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching video URL:", error);
        setLoading(false);

        // Fallback to test video
        const testUrl =
          "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4";
        setVideoUrl(testUrl);
        Alert.alert(
          "Info",
          "Using test video due to Jellyfin connection issues"
        );
      }
    };

    fetchJellyfinStream();
  }, [id]);

  // Report playback progress to Jellyfin
  const reportProgress = async (positionTicks, eventType = "timeupdate") => {
    try {
      const { serverUrl, itemId, apiKey, userId } = JELLYFIN_CONFIG;
      const endpoint =
        eventType === "start"
          ? "Playing"
          : eventType === "stop"
          ? "Stopped"
          : "Progress";

      await fetch(
        `${serverUrl}/Sessions/Playing/${endpoint}?api_key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `MediaBrowser Token="${apiKey}"`,
          },
          body: JSON.stringify({
            ItemId: itemId,
            UserId: userId,
            PositionTicks: positionTicks,
            IsPaused: !status.isPlaying,
            MediaSourceId: itemId,
            PlayMethod: "DirectStream",
          }),
        }
      );
    } catch (error) {
      console.log("Failed to report progress:", error);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        StatusBar.setHidden(false);
        setIsFullscreen(false);
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        StatusBar.setHidden(true);
        setIsFullscreen(true);
      }
    } catch (error) {
      console.log("Error toggling fullscreen:", error);
    }
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);

    if (playbackStatus.isLoaded && playbackStatus.positionMillis) {
      const positionTicks = Math.floor(playbackStatus.positionMillis * 10000);
      reportProgress(positionTicks);
    }
  };

  const getVideoStyle = () => {
    const { width: screenWidth, height: screenHeight } = screenData;

    if (isFullscreen || orientation === "landscape") {
      return {
        width: screenWidth,
        height: screenHeight,
      };
    } else {
      return {
        width: screenWidth,
        height: screenHeight * 0.6,
      };
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading video...</Text>
        {mediaInfo && <Text style={styles.mediaTitle}>{mediaInfo.Name}</Text>}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}
    >
      {videoUrl ? (
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={[styles.video, getVideoStyle()]}
            source={{
              uri: videoUrl,
              headers: {
                "User-Agent": "JellyfinApp/1.0.0",
                Authorization: `MediaBrowser Token="${JELLYFIN_CONFIG.apiKey}"`,
              },
            }}
            useNativeControls={!isFullscreen}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            shouldPlay={true}
            onError={(error) => {
              console.error("Video error details:", error);
              Alert.alert(
                "Playback Error",
                `Failed to play video. Error: ${error.error || "Unknown error"}`
              );
            }}
            onLoad={(data) => {
              console.log("Video loaded successfully");
              reportProgress(0, "start");
            }}
            onLoadStart={() => {
              console.log("Video load started");
            }}
          />

          {/* Custom Controls Overlay for Fullscreen/Landscape */}
          {(isFullscreen || orientation === 'landscape') && (
            <View style={styles.controlsOverlay}>
              <View style={styles.topControls}>
                <TouchableOpacity 
                  style={styles.fullscreenButton}
                  onPress={toggleFullscreen}
                >
                  <Ionicons name="contract-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.centerControls}>
                <TouchableOpacity 
                  style={styles.playPauseButton}
                  onPress={() => {
                    if (status.isPlaying) {
                      video.current?.pauseAsync();
                    } else {
                      video.current?.playAsync();
                    }
                  }}
                >
                  <Ionicons 
                    name={status.isPlaying ? "pause" : "play"} 
                    size={48} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
              
              {status.isLoaded && (
                <View style={styles.bottomControls}>
                  <View style={styles.progressContainer}>
                    <Text style={styles.timeText}>
                      {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
                    </Text>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          {
                            width: `${((status.positionMillis || 0) / (status.durationMillis || 1)) * 100}%`
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Fullscreen Toggle for Portrait Mode */}
          {!isFullscreen && (
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={toggleFullscreen}
            >
              <Ionicons name="expand-outline" size={24} color="white" />
            </TouchableOpacity>
          )}

          {/* Media Info */}
          {mediaInfo && !isFullscreen && (
            <View style={styles.mediaInfoContainer}>
              <Text style={styles.mediaTitle}>{mediaInfo.Name}</Text>
              {mediaInfo.Overview && (
                <Text style={styles.mediaOverview} numberOfLines={2}>
                  {mediaInfo.Overview}
                </Text>
              )}
            </View>
          )}
        </View>
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
    backgroundColor: "#000",
  },
  fullscreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  mediaInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 8,
  },
  mediaTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mediaOverview: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  fullscreenButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 20,
    zIndex: 1001,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    padding: 20,
  },
  playPauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 50,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderRadius: 2,
  },
  progressContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});

export default Player;
