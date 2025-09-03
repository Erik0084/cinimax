import { fetchAllMovies, fetchAllSeries, JELLYFIN_URL } from "@/utils/api/useJellyfin";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 48) / 2; // 2 columns with padding

const SeeAllMovies = () => {
  const { type = "movies", title = "All Content" } = useLocalSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const loadContent = async () => {
    try {
      let contentData;
      if (type === "series") {
        contentData = await fetchAllSeries();
      } else {
        contentData = await fetchAllMovies();
      }
      setContent(contentData);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Animate content appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  useEffect(() => {
    loadContent();
  }, [type]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadContent();
  };

  const handleItemPress = (item) => {
    if (type === "series") {
      router.push(`/media/series/${item.Id}`);
    } else {
      router.push(`/media/movies/${item.Id}`);
    }
  };

  const MovieItem = React.memo(({ item, index }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`
      : `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary`;

    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      const delay = index * 100; // Stagger animation
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(itemSlideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, [index]);

    return (
      <Animated.View
        style={{
          opacity: itemFadeAnim,
          transform: [{ translateY: itemSlideAnim }],
        }}
      >
        <TouchableOpacity
          style={{
            width: itemWidth,
            marginBottom: 20,
            marginRight: index % 2 === 0 ? 16 : 0,
          }}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}
        >
          <View className="bg-card_dark rounded-lg overflow-hidden">
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: "100%",
                height: itemWidth * 1.5,
                backgroundColor: "#1a1a1a",
              }}
              resizeMode="cover"
            />
            <View className="p-3">
              <Text
                className="text-white font-semibold text-sm mb-1"
                numberOfLines={2}
              >
                {item.Name}
              </Text>
              <Text className="text-grey text-xs mb-2">
                {item.ProductionYear || "Unknown Year"}
              </Text>
              {item.Genres && item.Genres.length > 0 && (
                <Text className="text-blue_accent text-xs" numberOfLines={1}>
                  {item.Genres.slice(0, 2).join(", ")}
                </Text>
              )}
              {item.CommunityRating && (
                <View className="flex-row items-center mt-2">
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text className="text-white text-xs ml-1">
                    {item.CommunityRating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  const renderMovieItem = ({ item, index }) => {
    return <MovieItem item={item} index={index} />;
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between mb-6">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 rounded-full bg-card_dark"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">{decodeURIComponent(title)}</Text>
      </View>
      <Text className="text-grey text-sm">
        {content.length} {content.length === 1 ? "item" : "items"}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name={type === "series" ? "tv-outline" : "film-outline"} size={64} color="#666" />
      <Text className="text-grey text-lg mt-4 mb-2">No {type} found</Text>
      <Text className="text-grey text-sm text-center px-8">
        There are no {type} available at the moment.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-dark">
        <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#12CDD9" />
          <Text className="text-grey mt-4 text-base">Loading {type}...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      <View className="flex-1 px-4 pt-8">
        {renderHeader()}
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <FlatList
            data={content}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.Id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={(data, index) => ({
              length: itemWidth * 1.5 + 20 + 80,
              offset: (itemWidth * 1.5 + 20 + 80) * Math.floor(index / 2),
              index,
            })}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default SeeAllMovies;