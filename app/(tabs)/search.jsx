import MoviesList from "@components/business/media/MoviesList";
import FeaturedMovieCard from "@components/ui/cards/FeaturedMovieCard";
import SearchResultCard from "@components/ui/cards/SearchResultCard";
import SearchBar from "@components/ui/navigation/SearchBar";
import { searchJellyfinContent } from "@utils/api/searchJellyfin";
import {
  fetchAllSeries,
  fetchCollectionItems,
  fetchCollections,
  fetchRecentSeries,
} from "@utils/api/useJellyfin";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { getFeaturedMovies } from "../../utils/api/searchJellyfin";

export default function Search() {
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [recentSeries, setRecentSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setHasSearched(false);
        setSearching(false);
        return;
      }

      setSearching(true);
      setHasSearched(true);

      try {
        const results = await searchJellyfinContent(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500); // 500ms debounce
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const featuredMovies = await getFeaturedMovies("sultan");
        setFeaturedMovies(featuredMovies);

        const collections = await fetchCollections();
        const recentSeriesData = await fetchRecentSeries();
        setRecentSeries(recentSeriesData);

        // Find "Trending Now" collection
        const trendingCollection = collections.find(
          (collection) => collection.Name === "Trending Now"
        );

        if (trendingCollection) {
          // Fetch items from "Trending Now" collection
          const trendingItems = await fetchCollectionItems(
            trendingCollection.Id
          );
          setTrendingSeries(trendingItems);
        } else {
          // Fallback to all series if "Trending Now" collection not found
          const series = await fetchAllSeries();
          setTrendingSeries(series.slice(0, 10)); // Limit to 10 items
        }
      } catch (error) {
        console.error("Failed to fetch series:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <View className="flex justify-start min-h-full pt-10 pb-32 px-6 bg-dark h-full">
        <ScrollView
          className="flex-1 px-0"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        >
          <SearchBar
            ref={searchInputRef}
            onSearch={handleSearch}
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={true}
          />

          {/* Search Results */}
          {hasSearched ? (
            <View className="mt-4">
              {searching ? (
                <View className="flex-1 justify-center items-center py-20">
                  <ActivityIndicator size="large" color="#12CDD9" />
                  <Text className="text-grey mt-4">Searching...</Text>
                </View>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    <>
                      <Text className="text-white text-xl font-bold mb-4">
                        Search Results ({searchResults.length})
                      </Text>
                      {searchResults.map((item) => (
                        <SearchResultCard key={item.Id} item={item} />
                      ))}
                    </>
                  ) : (
                    <View className="flex-1 justify-center items-center py-20">
                      <Text className="text-grey text-lg">
                        No results found
                      </Text>
                      <Text className="text-grey text-sm mt-2 text-center">
                        Try searching with different keywords
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            /* Default Content */
            <>
              {loading ? (
                <View className="flex-1 justify-center items-center py-20">
                  <ActivityIndicator size="large" color="#12CDD9" />
                  <Text className="text-grey mt-4">Loading...</Text>
                </View>
              ) : (
                <>
                  {featuredMovies.length > 0 && (
                    <FeaturedMovieCard featuredMovies={featuredMovies[0]} />
                  )}
                  {trendingSeries.length > 0 && (
                    <MoviesList
                      title="Recommended for you"
                      movies={trendingSeries}
                      series={true}
                    />
                  )}
                  {recentSeries.length > 0 && (
                    <MoviesList
                      title="You might like"
                      movies={recentSeries}
                      series={true}
                    />
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}
