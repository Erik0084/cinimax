import { JELLYFIN_URL } from "@/utils/api/useJellyfin";
import { Link } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import MovieCard from "../../ui/cards/MovieCard";

const FeaturedMovies = ({ title, movies, series, contentType = "movies" }) => {
  return (
    <View>
      <View className="mt-8">
        <View className="flex-row justify-between items-center mb-[16px]">
          <Text className="text-h4 text-white font-bold">{title}</Text>
          <Link
            href={`features/other/see-all?type=${contentType}&title=${encodeURIComponent(
              title
            )}`}
            asChild
          >
            <TouchableOpacity>
              <Text className=" text-h6 text-blue_accent">See All</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map((item) => {
            const imageUrl = item.ImageTags?.Primary
              ? `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}`
              : `${JELLYFIN_URL}/Items/${item.Id}/Images/Primary`;
            return (
              <MovieCard
                key={item.Id}
                id={item.Id}
                title={item.Name}
                genre={
                  item.GenreItems && item.GenreItems.length > 0
                    ? item.GenreItems[0].Name
                    : ""
                }
                imageUrl={imageUrl}
                rating={item.CommunityRating}
                releaseDate={item.PremiereDate}
                series={series}
                year={item.PremiereDate?.substring(0, 4)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default FeaturedMovies;
