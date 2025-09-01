// Components/EpisodeCard.jsx
import { Icons } from "@/constants/icons";
import { useDownloads } from "@/contexts/DownloadContext";
import {
  API_KEY,
  fetchEpisodes,
  fetchSeasons,
  JELLYFIN_URL,
} from "@/utils/api/useJellyfin";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import SeasonSelectionModal from "../modals/SeasonSelectionModal";

const EpisodeCard = ({ episode, seriesId, onPlay }) => {
  const { startDownload, downloads, DOWNLOAD_STATES } = useDownloads();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Check if this episode is already being downloaded or completed
  const existingDownload = downloads.find(d => d.itemId === episode.Id);
  const isAlreadyDownloading = existingDownload && 
    (existingDownload.status === DOWNLOAD_STATES.DOWNLOADING || 
     existingDownload.status === DOWNLOAD_STATES.PENDING);
  const isCompleted = existingDownload && existingDownload.status === DOWNLOAD_STATES.COMPLETED;
  const downloadProgress = existingDownload ? (existingDownload.progress * 100) : 0;

  const formatDuration = (ticks) => {
    if (!ticks) return "N/A";
    const minutes = Math.round(ticks / 600000000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h${remainingMinutes}m` : `${minutes}m`;
  };

  const getEpisodeImage = () => {
    if (episode?.ImageTags?.Primary) {
      return `${JELLYFIN_URL}/Items/${episode.Id}/Images/Primary?tag=${episode.ImageTags.Primary}`;
    }
    return "https://i.pinimg.com/736x/b0/41/bc/b041bc4d2e2e3c425cae4eb5c3f27a10.jpg";
  };

  const handleDownload = async () => {
    // If already completed, show success message without popup
    if (isCompleted) {
      return;
    }
    
    // Only show popup if already downloading/pending
    if (isDownloading || isAlreadyDownloading) {
      return;
    }

    try {
      setIsDownloading(true);

      // Use the correct Jellyfin configuration from useJellyfin.js
      const JELLYFIN_CONFIG = {
        serverUrl: JELLYFIN_URL,
        apiKey: API_KEY,
      };

      // Start download using the DownloadContext
      await startDownload(episode, JELLYFIN_CONFIG);
      
      console.log("Download started for episode:", episode.Name);
    } catch (error) {
      console.error("Download failed:", error);
      // Only show error popup for actual failures
      Alert.alert(
        "Download Failed",
        "Failed to start download. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View className="bg-soft rounded-xl p-3 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="relative w-36 h-24 rounded-lg overflow-hidden mr-4">
          <Image
            source={{ uri: getEpisodeImage() }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute inset-0 items-center justify-center bg-black/30"
            onPress={() => onPlay && onPlay(episode.Id)}
          >
            <Image
              source={Icons.PlayButton}
              className="w-10 h-10"
              tintColor="#fff"
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-row items-center py-2">
          <View className="flex-1">
            <Text className="text-grey text-h6">
              {formatDuration(episode?.RunTimeTicks)}
            </Text>
            <Text className="text-white text-h4 font-bold">
              {episode?.Name || `Episode ${episode?.IndexNumber || "N/A"}`}
            </Text>
          </View>
          <TouchableOpacity
            className="p-2 rounded-full bg-black"
            onPress={handleDownload}
            disabled={isDownloading || isAlreadyDownloading}
          >
            {isCompleted ? (
               <Image
                 source={Icons.tick}
                 className="w-6 h-6"  
                 tintColor="#00FF00"
               />
            ) : (
              <Image
                source={Icons.download}
                className="w-6 h-6"
                tintColor={(isDownloading || isAlreadyDownloading) ? "#666" : "#FF8700"}
              />
            )}
            {(isDownloading || isAlreadyDownloading) && !isCompleted && (
              <View className="absolute inset-0 items-center justify-center">
                <Text className="text-white text-xs">
                  {Math.round(downloadProgress)}%
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text
        className="text-grey text-h5 leading-6 text-justify"
        numberOfLines={2}
      >
        {episode?.Overview || "No description available for this episode."}
      </Text>
    </View>
  );
};

const EpisodeList = ({ seriesId, onPlay }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch seasons when component mounts
  useEffect(() => {
    const loadSeasons = async () => {
      if (!seriesId) return;

      try {
        setLoading(true);
        const seasonsData = await fetchSeasons(seriesId);
        setSeasons(seasonsData);

        // Set first season as default
        if (seasonsData.length > 0) {
          setSelectedSeason(seasonsData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch seasons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, [seriesId]);

  // Fetch episodes when selected season changes
  useEffect(() => {
    const loadEpisodes = async () => {
      if (!seriesId || !selectedSeason) return;

      try {
        const episodesData = await fetchEpisodes(seriesId, selectedSeason.Id);
        setEpisodes(episodesData);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

    loadEpisodes();
  }, [seriesId, selectedSeason]);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    setModalVisible(false);
  };

  return (
    <View className="">
      {/* <Text className="text-white text-h3 font-semibold mb-4">Episode</Text> */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-h4 font-semibold mr-2">
          {selectedSeason?.Name || "Loading..."}
        </Text>
        <Image
          source={Icons.arrowIosDownward}
          className="w-4 h-4"
          tintColor="#fff"
        />
      </TouchableOpacity>

      {episodes.map((episode) => (
        <EpisodeCard
          key={episode.Id}
          episode={episode}
          seriesId={seriesId}
          onPlay={onPlay}
        />
      ))}

      {episodes.length === 0 && !loading && (
        <Text className="text-grey text-center py-4">
          No episodes available for this season.
        </Text>
      )}

      {isModalVisible && (
        <SeasonSelectionModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSelectSeason={handleSeasonSelect}
          currentSeason={selectedSeason}
          seasons={seasons}
        />
      )}
    </View>
  );
};

export default EpisodeList;
