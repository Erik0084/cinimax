import { Icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";
import { JELLYFIN_URL } from "../../../utils/api/useJellyfin";

const FeaturedMovieCard = ({ featuredMovies }) => {
  return (
    <View className="relative flex-row gap-[18px] items-center mt-8">
      {/* Movie Poster with Premium Badge */}
      <View className="relative rounded-xl overflow-hidden">
        <Image
          source={{
            uri:
              `${JELLYFIN_URL}/Items/${featuredMovies.Id}/Images/Primary?format=jpg&quality=80` ||
              "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
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

      {/* Movie Details */}
      <View className="flex-1 gap-2">
        {/* Premium Badge */}
        <View className="bg-orange flex-row justify-center px-[4px] py-[3px] max-w-[70px] rounded-md">
          <Text className="text-[11px] text-white">Premium</Text>
        </View>
        <Text className="text-white text-xl my-1 font-bold" numberOfLines={2}>
          {featuredMovies.Name || "Unknown Title"}
        </Text>
        <View className="flex-row items-center gap-[5px]">
          <Image source={Icons.calendar} className="w-4 h-4 text-grey" />
          <Text className="text-grey text-sm" style={{ lineHeight: 16 }}>
            {featuredMovies.ProductionYear || "Unknown Year"}
          </Text>
        </View>

        <View className="flex-row gap-[5px] items-center">
          <Image source={Icons.clock} className="w-4 h-4 color-grey" />
          <Text className=" text-grey text-sm">
            {featuredMovies.Type || "Unknown Type"}
          </Text>
          <Text
            className=" text-sm px-[6px] py-[2px] text-blue_accent border-blue_accent ml-[6px]"
            style={{ borderWidth: 1, borderRadius: 3 }}
          >
            {featuredMovies.CommunityRating || "Unknown Rating"}
          </Text>
        </View>

        <View className="flex-row gap-[5px] items-center">
          <Image source={Icons.film} className="w-4 h-4 text-yellow-500" />
          <Text className="text-grey text-sm font-bold">
            {featuredMovies.Genres || "Unknown Genre"}
          </Text>
          {/* <View className="w-[1px] h-[80%] bg-grey mx-1 rounded-full" /> */}
          {/* <Text className="text-grey text-sm">
            {featuredMovies.Type || "Unknown Type"}
          </Text> */}
        </View>
      </View>
    </View>
  );
};

export default FeaturedMovieCard;
