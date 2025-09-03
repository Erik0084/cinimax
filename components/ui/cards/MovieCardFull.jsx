import { Icons } from "@/constants/icons";
import { API_KEY, fetchSeasons, JELLYFIN_URL } from "@/utils/api/useJellyfin";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const MovieCardFull = ({ title, date, genre, imageUrl, movie }) => {
  const movieId = movie?.Id;
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeasons = async () => {
      if (!movie?.Id) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedSeasons = await fetchSeasons(movie.Id);
        // console.log("Fetched seasons:", fetchedSeasons);

        // Handle the response - it should be an array of season objects
        if (Array.isArray(fetchedSeasons)) {
          setSeasons(fetchedSeasons);
        } else {
          console.warn(
            "Expected array of seasons, got:",
            typeof fetchedSeasons
          );
          setSeasons([]);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
        setError(err.message || "Failed to load seasons");
        setSeasons([]);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, [movie?.Id]);

  return (
    <View className="">
      <Link href={`/media/series/${movieId}`} asChild>
        <TouchableOpacity>
          <View className="relative w-full h-52">
            <Image
              source={{
                uri:
                  imageUrl ||
                  (seasons.length > 0 && seasons[0].ImageTags?.Primary
                    ? `${JELLYFIN_URL}/Items/${seasons[0].Id}/Images/Primary`
                    : "https://i.pinimg.com/736x/65/5e/e0/655ee0b8e348b99696ef44605bbaddce.jpg"),
              }} // Placeholder image
              className="w-full h-full absolute  rounded-xl overflow-hidden"
              resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center bg-black/30">
              <Image
                source={Icons.play}
                className="w-12 h-12"
                tintColor="#fff"
              />
            </View>
            {/* Season Count Badge */}
            {seasons.length > 0 && (
              <View className="absolute bottom-2 right-2 bg-blue_accent px-2 py-1 rounded-md">
                <Text className="text-white text-xs font-bold">
                  S{seasons.length}
                </Text>
              </View>
            )}

            {/* Loading Badge */}
            {loading && (
              <View className="absolute bottom-2 right-2 bg-grey px-2 py-1 rounded-md">
                <Text className="text-white text-xs font-bold">...</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Link>
      <View className=" px-0">
        <Text className="text-white text-h4 font-bold mb-2">
          {title ||
            (seasons.length > 0 ? seasons[0].SeriesName : "Unknown Title")}
        </Text>

        {/* Season Information */}
        {seasons.length > 0 && (
          <View className="mb-4">
            <Text className="text-blue_accent text-h6 font-semibold mb-3">
              {seasons.length} Season{seasons.length > 1 ? "s" : ""} Available
            </Text>

            {/* Seasons Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4"
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {seasons.map((season, index) => (
                <Link href={`/media/series/${movieId}`} asChild key={season.Id}>
                  <TouchableOpacity
                    className="mr-3 bg-dark_light rounded-lg overflow-hidden"
                    style={{ minWidth: "40%" }}
                  >
                    <View className="relative">
                      <Image
                        source={{
                          uri: season.ImageTags?.Primary
                            ? `${JELLYFIN_URL}/Items/${season.Id}/Images/Primary?api_key=${API_KEY}&tag=${season.ImageTags.Primary}&width=240&height=360`
                            : "https://i.pinimg.com/736x/65/5e/e0/655ee0b8e348b99696ef44605bbaddce.jpg",
                        }}
                        className="w-full h-32 rounded-t-lg"
                        resizeMode="cover"
                      />

                      {/* Season Number Badge */}
                      <View className="absolute top-2 right-2 bg-blue_accent px-2 py-1 rounded-md">
                        <Text className="text-white text-xs font-bold">
                          S{season.IndexNumber || index + 1}
                        </Text>
                      </View>

                      {/* Episode Count Badge */}
                      {season.UserData?.UnplayedItemCount && (
                        <View className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded-md">
                          <Text className="text-white text-xs">
                            {season.UserData.UnplayedItemCount} eps
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="p-2">
                      <Text
                        className="text-white text-xs font-semibold mb-1"
                        numberOfLines={1}
                      >
                        {season.Name}
                      </Text>
                      <Text className="text-grey text-xs" numberOfLines={1}>
                        {season.ProductionYear || "Unknown Year"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>

            {/* <Text className="text-grey text-h7 mt-2">
              Latest: {seasons[seasons.length - 1]?.Name || "Unknown Season"}
            </Text> */}
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <Text className="text-grey text-h6 mb-2">Loading seasons...</Text>
        )}

        {/* Error State */}
        {error && <Text className="text-red text-h6 mb-2">Error: {error}</Text>}

        {/* <View className=" absolute flex-row items-center">
          <Image
            source={Icons.calendar}
            className="w-[14px] h-auto aspect-square mr-1"
            tintColor="#9CA3AF"
          />
          <Text className="text-gray-400 text-h6 mr-4">
            {date ||
              (seasons.length > 0
                ? seasons[0].ProductionYear || "Unknown Year"
                : "Unknown Year")}
          </Text>
          <Image
            source={Icons.film}
            className="w-[14px] h-auto aspect-square mr-1"
            tintColor="#9CA3AF"
          />
          <Text className="text-gray-400 text-h6">
            {genre || (seasons.length > 0 ? "Series" : "Unknown")}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default MovieCardFull;
