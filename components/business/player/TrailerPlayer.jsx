import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { fetchSeriesTrailer } from "@utils/api/useJellyfin";
import { Video } from "expo-av";
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

// Custom Landscape Trailer Player Component
const CustomLandscapeTrailerPlayer = ({
  videoUrl,
  trailerInfo,
  onClose,
  isRemoteTrailer = false,
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
      resetControlsTimeout();
    } catch (error) {
      console.log("Error seeking:", error);
    }
  };

  const handleClose = async () => {
    try {
      // Stop video playback
      await videoRef.current?.pauseAsync();
      await videoRef.current?.unloadAsync();
      onClose();
    } catch (error) {
      console.log("Error closing trailer player:", error);
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
          ...(isRemoteTrailer
            ? {}
            : {
                headers: {
                  "User-Agent": "JellyfinApp/1.0.0",
                },
              }),
        }}
        useNativeControls={false}
        resizeMode="contain"
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoad={(data) => {
          console.log("Trailer loaded successfully");
          setLoading(false);
        }}
        onError={(error) => {
          console.error("Trailer error:", error);
          setLoading(false);
        }}
      />

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff6b6b" />
          <Text style={styles.loadingText}>Loading trailer...</Text>
          {trailerInfo && (
            <Text style={styles.mediaTitle}>{trailerInfo.name}</Text>
          )}
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

            {trailerInfo && (
              <View style={styles.mediaInfoTop}>
                <Text style={styles.mediaTitle} numberOfLines={1}>
                  {trailerInfo.name}
                </Text>
                <Text style={styles.trailerLabel}>Trailer</Text>
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

// Main Trailer Player Component
const TrailerPlayer = ({ seriesId, seriesName, onClose }) => {
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerInfo, setTrailerInfo] = useState(null);
  const [isRemoteTrailer, setIsRemoteTrailer] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

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

  // Fetch trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const trailer = await fetchSeriesTrailer(seriesId);

        if (trailer) {
          setTrailerUrl(trailer.url);
          setTrailerInfo({
            name: trailer.name || `${seriesName} Trailer`,
            id: trailer.id,
          });
          setIsRemoteTrailer(trailer.type === "remote");
        } else {
          // No trailer found
          Alert.alert(
            "No Trailer Available",
            "Sorry, no trailer is available for this series.",
            [
              {
                text: "OK",
                onPress: handleClose,
              },
            ]
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setLoading(false);

        Alert.alert(
          "Error",
          "Failed to load trailer. Please try again later.",
          [
            {
              text: "OK",
              onPress: handleClose,
            },
          ]
        );
      }
    };

    fetchTrailer();
  }, [seriesId, seriesName]);

  const handleClose = async () => {
    try {
      // Reset orientation before closing
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      StatusBar.setHidden(false);
      onClose();
    } catch (error) {
      console.log("Error closing trailer player:", error);
      onClose();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading trailer...</Text>
        {seriesName && (
          <Text style={styles.mediaTitle}>{seriesName} Trailer</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {trailerUrl ? (
        <CustomLandscapeTrailerPlayer
          videoUrl={trailerUrl}
          trailerInfo={trailerInfo}
          onClose={handleClose}
          isRemoteTrailer={isRemoteTrailer}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No trailer available</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
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
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  trailerLabel: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "600",
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

export default TrailerPlayer;
