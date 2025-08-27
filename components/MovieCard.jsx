// components/MovieCard.js
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({ id, title, genre, imageUrl, series }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <Link
      className=""
      href={series ? `/series/${id}` : `/movies/${id}`}
      asChild
    >
      <TouchableOpacity className=" mr-2" activeOpacity={0.9}>
        <View className="bg-soft w-32 rounded-md overflow-hidden relative">
          {isLoading && (
            <View
              className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center"
              style={{ aspectRatio: 2 / 2.4 }}
            >
              <View className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
            </View>
          )}
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-auto object-cover"
            resizeMode="cover"
            style={{ aspectRatio: 2 / 2.4 }}
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={(error) => {
              console.log("Image load error:", error.nativeEvent.error);
              handleImageLoadEnd();
            }}
            defaultSource={require("@/assets/images/slider-1.png")}
          />
          <View className="p-[8px] pb-[8px]">
            <Text
              className="text-white text-[11px] font-semibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            {genre && (
              <Text className="text-white text-[9px] bg-blue_accent mt-1 w-[40px] text-center rounded-sm absolute top-1 right-2">
                {genre}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
