import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Video } from "expo-av";
import { router } from "expo-router";
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
import { API_KEY, JELLYFIN_URL, USER_ID } from "@utils/api/useJellyfin";

// Custom Landscape Video Player Component
const CustomLandscapePlayer = ({
  videoUrl,
  mediaInfo,
  onClose,
  jellyfinConfig,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Show controls on touch
  const handleScreenTouch = () => {
    resetControlsTimeout();
  };

  // Report progress to Jellyfin
  const reportProgress = async (positionTicks, eventType = "timeupdate") => {
    try {
      const { serverUrl, itemId, apiKey, userId } = jellyfinConfig;
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
            IsPaused: !isPlaying,
            MediaSourceId: itemId,
            PlayMethod: "DirectStream",
          }),
        }
      );
    } catch (error) {
      console.log("Failed to report progress:", error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await videoRef.current?.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current?.playAsync();
        setIsPlaying(true);
      }
      resetControlsTimeout();
    } catch (error) {
      console.log("Error toggling play/pause:", error);
    }
  };

  const handleSeek = async (value) => {
    try {
      await videoRef.current?.setPositionAsync(value);
      setCurrentTime(value);
      reportProgress(Math.floor(value * 10000));
      resetControlsTimeout();
    } catch (error) {
      console.log("Error seeking:", error);
    }
  };

  const handleClose = async () => {
    try {
      // Report stop to Jellyfin
      if (currentTime > 0) {
        const positionTicks = Math.floor(currentTime * 10000);
        await reportProgress(positionTicks, "stop");
      }

      // Stop video playback
      await videoRef.current?.pauseAsync();
      await videoRef.current?.unloadAsync();

      onClose();
    } catch (error) {
      console.log("Error closing player:", error);
      onClose();
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

  const handlePlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
      setLoading(false);

      // Report progress to Jellyfin
      if (status.positionMillis) {
        const positionTicks = Math.floor(status.positionMillis * 10000);
        reportProgress(positionTicks);
      }
    }
  };

  // Initialize controls timeout
  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const screenData = Dimensions.get("window");

  return (
    <TouchableOpacity
      style={styles.customPlayerContainer}
      activeOpacity={1}
      onPress={handleScreenTouch}
    >
      <Video
        ref={videoRef}
        style={{
          width: screenData.width,
          height: screenData.height,
        }}
        source={{
          uri: videoUrl,
          headers: {
            "User-Agent": "JellyfinApp/1.0.0",
            Authorization: `MediaBrowser Token="${jellyfinConfig.apiKey}"`,
          },
        }}
        useNativeControls={false}
        resizeMode="contain"
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoad={(data) => {
          console.log("Video loaded successfully");
          reportProgress(0, "start");
          setLoading(false);
        }}
        onError={(error) => {
          console.error("Video error:", error);
          setLoading(false);
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff6b6b" />
          <Text style={styles.loadingText}>Loading video...</Text>
          {mediaInfo && <Text style={styles.mediaTitle}>{mediaInfo.Name}</Text>}
        </View>
      )}

      {/* Custom Controls Overlay */}
      {showControls && !loading && (
        <View style={styles.controlsOverlay}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            {mediaInfo && (
              <View style={styles.mediaInfoTop}>
                <Text style={styles.mediaTitle} numberOfLines={1}>
                  {mediaInfo.Name}
                </Text>
                {mediaInfo.ProductionYear && (
                  <Text style={styles.mediaYear}>
                    {mediaInfo.ProductionYear}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.topRightControls}>
              <TouchableOpacity style={styles.settingsButton}>
                <Ionicons name="settings-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Center Controls */}
          <View style={styles.centerControls}>
            <TouchableOpacity
              style={styles.seekButton}
              onPress={() => handleSeek(Math.max(0, currentTime - 10000))}
            >
              <Ionicons name="play-back" size={32} color="white" />
              <Text style={styles.seekText}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={handlePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={56}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.seekButton}
              onPress={() =>
                handleSeek(Math.min(duration, currentTime + 10000))
              }
            >
              <Ionicons name="play-forward" size={32} color="white" />
              <Text style={styles.seekText}>10</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <View style={styles.progressContainer}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>

              <Slider
                style={styles.progressSlider}
                minimumValue={0}
                maximumValue={duration || 1}
                value={currentTime}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor="#ff6b6b"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbStyle={styles.sliderThumb}
              />
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Main Player Component
const Player = ({ id }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  // Jellyfin configuration
  const JELLYFIN_CONFIG = {
    serverUrl: JELLYFIN_URL,
    itemId: id,
    apiKey: API_KEY,
    userId: USER_ID,
  };

  // Set landscape orientation on component mount
  useEffect(() => {
    const setLandscapeOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        StatusBar.setHidden(true);
      } catch (error) {
        console.log("Error setting landscape orientation:", error);
      }
    };

    setLandscapeOrientation();
  }, []);

  // Reset screen orientation when component unmounts
  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        .then(() => {
          StatusBar.setHidden(false);
        })
        .catch((error) => {
          console.log("Error resetting orientation:", error);
        });
    };
  }, []);

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
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

  const handleClose = async () => {
    try {
      // Reset orientation before navigating back
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      StatusBar.setHidden(false);
      router.back();
    } catch (error) {
      console.log("Error closing player:", error);
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading video...</Text>
        {mediaInfo && <Text style={styles.mediaTitle}>{mediaInfo.Name}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videoUrl ? (
        <CustomLandscapePlayer
          videoUrl={videoUrl}
          mediaInfo={mediaInfo}
          onClose={handleClose}
          jellyfinConfig={JELLYFIN_CONFIG}
        />
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
  customPlayerContainer: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 2000,
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
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
  },
  closeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
    borderRadius: 25,
  },
  mediaInfoTop: {
    flex: 1,
    marginHorizontal: 20,
  },
  mediaTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  mediaYear: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  topRightControls: {
    flexDirection: "row",
  },
  settingsButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 12,
    borderRadius: 25,
  },
  centerControls: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  seekButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  seekText: {
    color: "white",
    fontSize: 10,
    position: "absolute",
    bottom: 2,
    fontWeight: "bold",
  },
  playPauseButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    borderRadius: 50,
  },
  bottomControls: {
    padding: 20,
    paddingBottom: 30,
  },
  progressContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 10,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  progressSlider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#ff6b6b",
    width: 18,
    height: 18,
  },
});

export default Player;
