import { Icons } from "@/constants/icons";
import { getJellyfinImageUrl, formatRuntime } from "@/utils/api/searchJellyfin";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const SearchResultCard = ({ item }) => {
  const router = useRouter();
  
  if (!item) return null;
  
  const imageUrl = getJellyfinImageUrl(item.Id);
  const runtime = formatRuntime(item.RunTimeTicks);
  const genres = item.Genres ? item.Genres.slice(0, 1).join(", ") : "";
  const itemType = item.Type === "Series" ? "Series" : "Movie";
  
  const handlePress = () => {
    if (item.Type === "Series") {
      router.push(`/media/series/${item.Id}`);
    } else {
      router.push(`/media/movies/${item.Id}`);
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="relative flex-row gap-[18px] items-center mt-8">
        {/* Movie/Series Poster */}
        <View className="relative rounded-xl overflow-hidden">
          <Image
            source={{
              uri: imageUrl || "https://via.placeholder.com/300x450/333/fff?text=No+Image",
            }}
            className="w-32 h-auto rounded-xl"
            resizeMode="cover"
            style={{ aspectRatio: 2 / 2.8 }}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
            className="absolute bottom-0 left-0 right-0 h-32"
          />
        </View>

        {/* Content Details */}
        <View className="flex-1 gap-2">
          {/* Premium Badge */}
          <View className="bg-orange flex-row justify-center px-[4px] py-[3px] max-w-[70px] rounded-md">
            <Text className="text-[11px] text-white">Premium</Text>
          </View>
          
          <Text className="text-white text-xl my-1 font-bold" numberOfLines={2}>
            {item.Name || "Unknown Title"}
          </Text>
          
          {item.ProductionYear && (
            <View className="flex-row items-center gap-[5px]">
              <Image source={Icons.calendar} className="w-4 h-4 text-grey" />
              <Text className="text-grey text-sm" style={{ lineHeight: 16 }}>
                {item.ProductionYear}
              </Text>
            </View>
          )}

          <View className="flex-row gap-[5px] items-center">
            {runtime && (
              <>
                <Image source={Icons.clock} className="w-4 h-4 color-grey" />
                <Text className="text-grey text-sm">{runtime} Minutes</Text>
              </>
            )}
            {item.OfficialRating && (
              <Text
                className="text-sm px-[6px] py-[2px] text-blue_accent border-blue_accent ml-[6px]"
                style={{ borderWidth: 1, borderRadius: 3 }}
              >
                {item.OfficialRating}
              </Text>
            )}
          </View>

          <View className="flex-row gap-[5px] items-center">
            <Image source={Icons.film} className="w-4 h-4 text-yellow-500" />
            {genres && (
              <>
                <Text className="text-grey text-sm font-bold">{genres}</Text>
                <View className="w-[1px] h-[80%] bg-grey mx-1 rounded-full" />
              </>
            )}
            <Text className="text-grey text-sm">{itemType}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchResultCard;
