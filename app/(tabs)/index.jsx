import MoviesList from "@components/business/media/MoviesList";
import Slider from "@components/business/media/Slider";
import MovieCardFull from "@components/ui/cards/MovieCardFull";
import SearchBar from "@components/ui/navigation/SearchBarHome";
import {
  fetchAllSeries,
  fetchCollectionItems,
  fetchCollections,
  fetchRecentSeries,
} from "@utils/api/useJellyfin";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [jellyfinSeries, setJellyfinSeries] = useState([]);
  const [newRelease, setNewRelease] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("jellyfinSeries", jellyfinSeries);

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const collections = await fetchCollections();
        const recentSeriesData = await fetchRecentSeries();
        setRecentSeries(recentSeriesData);
        // console.log("collection", collections);

        // Find "Trending Now" collection
        const trendingCollection = collections.find(
          (collection) => collection.Name === "Trending Now"
        );
        // Find "New Release" collection
        const newReleaseCollection = collections.find(
          (collection) => collection.Name === "New Release"
        );

        if (trendingCollection || newReleaseCollection) {
          // Fetch items from "Trending Now" collection
          const trendingItems = await fetchCollectionItems(
            trendingCollection.Id
          );
          const newReleaseItems = await fetchCollectionItems(
            newReleaseCollection.Id
          );
          setJellyfinSeries(trendingItems);
          setNewRelease(newReleaseItems);
        } else {
          // Fallback to all series if "Trending Now" collection not found
          const series = await fetchAllSeries();
          setJellyfinSeries(series);
        }

        // const featuredSeason = await getFeaturedMovies("sultan");
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  return (
    <>
      <View className="flex-1 justify-start min-h-screen bg-dark h-">
        <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
        <ScrollView
          className="flex-1 px-0 pb-20"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#12CDD9" />
              <Text className="text-grey mt-4">Loading...</Text>
            </View>
          ) : (
            <>
              <View className="w-full mt-8 mb-6 px-4">
                <View className="w-full">
                  <SearchBar />
                </View>
              </View>
              {/* <JellyfinPlayer /> */}
              <Slider series={jellyfinSeries} />
              <View className="w-full pb-20 mt-2 px-4">
                <View className="most__popular w-full">
                  {/* <Categories /> */}
                  <MoviesList
                    title="Treading now"
                    movies={jellyfinSeries}
                    series={true}
                    contentType="series"
                  />
                  <MoviesList
                    title="Recently Added Series"
                    movies={recentSeries}
                    series={true}
                    contentType="series"
                  />
                  <View className="">
                    <MovieCardFull movie={jellyfinSeries[0]} />
                  </View>
                  <MoviesList
                    title="New Release"
                    movies={newRelease}
                    series={true}
                    contentType="series"
                  />
                  <View className="">
                    <MovieCardFull movie={jellyfinSeries[1]} />
                  </View>
                  <MoviesList
                    title="Top Rated"
                    movies={jellyfinSeries}
                    series={true}
                    contentType="series"
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}
