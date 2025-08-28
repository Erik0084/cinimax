// app/series/[id].jsx

import { useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EpisodeList from "../../components/EpisodeCard";
import Player from "../../components/Global/Player";
import { Icons } from "../../constants/icons";
import { fetchAllSeries, JELLYFIN_URL } from "../../utils/useJellyfin";

const SeriesDetail = () => {
  const { id } = useLocalSearchParams(); // series id
  const [isPlaying, setIsPlaying] = useState(false);
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisodeId, setCurrentEpisodeId] = useState(null);
  const [closePlayer, setClosePlayer] = useState(false);

  // Fetch series data
  useEffect(() => {
    const loadSeriesData = async () => {
      try {
        setLoading(true);
        const allSeries = await fetchAllSeries();
        const series = allSeries.find((s) => s.Id === id);
        setSeriesData(series);
      } catch (error) {
        console.error("Failed to fetch series data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSeriesData();
    }
  }, [id]);

  // Ensure this screen is always portrait when not playing video
  useEffect(() => {
    const ensurePortrait = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      } catch (error) {
        console.warn("Failed to lock to portrait:", error);
      }
    };

    if (!isPlaying) {
      ensurePortrait();
    }
  }, [isPlaying]);

  const handlePlayPress = () => {
    setCurrentEpisodeId(id); // Use series ID as fallback
    setIsPlaying(true);
  };

  const handleEpisodePlay = (episodeId) => {
    setCurrentEpisodeId(episodeId);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
    setCurrentEpisodeId(null);
    setClosePlayer(false); // Reset closePlayer state
    // Ensure we return to portrait after closing player
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    ).catch(console.warn);
  };

  // Handle closePlayer state change
  useEffect(() => {
    if (closePlayer) {
      handleClosePlayer();
    }
  }, [closePlayer]);

  if (isPlaying && !closePlayer) {
    return (
      <View className="flex-1 bg-black">
        <Player
          setClosePlayer={setClosePlayer}
          id={currentEpisodeId || id}
          onClose={handleClosePlayer}
        />
      </View>
    );
  }

  return ( 
    <ScrollView className="flex-1 bg-black">
      {/* Background Image and Overlay */}
      <View className="relative w-full h-[74vh]">
        <View className="w-full h-full relative">
          <ImageBackground
            source={{
              uri: seriesData?.BackdropImageTags?.[0]
                ? `${JELLYFIN_URL}/Items/${seriesData.Id}/Images/Backdrop/0?tag=${seriesData.BackdropImageTags[0]}`
                : "https://i.pinimg.com/736x/43/4c/4a/434c4a4819c0c21d3c3895530e90d19a.jpg",
            }}
            className="w-full h-full absolute top-0 left-0 right-0"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black opacity-70" />
        </View>
        <View className="absolute bottom-0 left-0 right-0 top-0 mt-12 items-center justify-center">
          <Image
            source={{
              uri: seriesData?.ImageTags?.Primary
                ? `${JELLYFIN_URL}/Items/${seriesData.Id}/Images/Primary?tag=${seriesData.ImageTags.Primary}`
                : "https://i.pinimg.com/736x/c3/f1/06/c3f1068e18413f10bae29d50ee10b8af.jpg",
            }}
            className="w-[220px] h-auto rounded-xl"
            style={{ aspectRatio: "2/3" }}
          />
          <View className="flex items-center mb-2">
            <View>
              <View className="flex-row items-center mb-2 mt-4">
                <Image
                  source={Icons.calendar}
                  className="w-4 h-4 mr-[5px]"
                  tintColor="#92929D"
                />
                <Text className="text-grey text-h5 mr-4">
                  {seriesData?.ProductionYear || "N/A"}
                </Text>
                <Image
                  source={Icons.clock}
                  className="w-4 h-4 mr-[5px]"
                  tintColor="#92929D"
                />
                <Text className="text-grey text-h5 mr-4">
                  {seriesData?.RunTimeTicks
                    ? Math.round(seriesData.RunTimeTicks / 600000000) +
                      " Minutes"
                    : "N/A"}
                </Text>
                <Image
                  source={Icons.film}
                  className="w-4 h-4 mr-[5px]"
                  tintColor="#92929D"
                />
                <Text className="text-grey text-h5 mr-4">
                  {seriesData?.GenreItems?.[0]?.Name || "N/A"}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Image
                  source={Icons.star}
                  className="w-4 h-4 mr-1"
                  tintColor="#FF8700"
                />
                <Text className="text-orange text-h5 mr-4">
                  {seriesData?.CommunityRating
                    ? seriesData.CommunityRating.toFixed(1)
                    : "N/A"}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-around items-center mt-6 px-4">
              <TouchableOpacity
                className="flex-row items-center bg-blue_accent px-8 py-3 rounded-full flex mr-2 justify-center"
                onPress={handlePlayPress}
              >
                <Image
                  source={Icons.film}
                  className="w-5 h-5 mr-2"
                  tintColor="#fff"
                />
                <Text className="text-white text-h4 font-bold">Play</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-soft p-[12px] rounded-full mx-2">
                <Image
                  source={Icons.download}
                  className="w-6 h-6"
                  tintColor="#12CDD9"
                />
              </TouchableOpacity>
              <TouchableOpacity className="bg-soft p-4 rounded-full ml-2">
                <Image
                  source={Icons.share41}
                  className="w-5 h-5"
                  tintColor="#12CDD9"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Story Line */}
      <View className="mt-6 px-6">
        <Text className="text-white text-h3 font-bold mb-2">
          {seriesData?.Name}
        </Text>
        <Text className="text-grey text-h5 leading-6" numberOfLines={4}>
          {seriesData?.Overview || "No overview available for this series."}
          {seriesData?.Overview && <Text className="text-primary"> More</Text>}
        </Text>
      </View>
      <View className="mt-6 px-6 mb-20">
        <EpisodeList seriesId={id} onPlay={handleEpisodePlay} />
      </View>
    </ScrollView>
  );
};

export default SeriesDetail;
