// components/MovieCard.js
import { Icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";

const MovieCard = ({ id, title, genre, imageUrl, series, rating, year }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  const handleImageLoadEnd = () => {
    setIsLoading(false);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Link
      className="mr-3"
      href={series ? `/media/series/${id}` : `/media/movies/${id}`}
      asChild
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          className="w-36 mb-4"
          style={{ transform: [{ scale: scaleValue }] }}
        >
          <View className=" rounded-xl overflow-hidden relative">
            {/* Loading State */}
            {isLoading && (
              <View
                className="absolute inset-0 bg-dark_gray/50 flex items-center justify-center z-10"
                style={{ aspectRatio: 2 / 3 }}
              >
                <View className="w-10 h-10 bg-grey/30 rounded-full animate-pulse" />
                <View className="w-16 h-2 bg-grey/20 rounded-full mt-2 animate-pulse" />
              </View>
            )}

            {/* Movie Poster */}
            <View className="relative">
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-auto"
                resizeMode="cover"
                style={{ aspectRatio: 2 / 3 }}
                onLoadStart={handleImageLoadStart}
                onLoadEnd={handleImageLoadEnd}
                onError={(error) => {
                  console.log("Image load error:", error.nativeEvent.error);
                  handleImageLoadEnd();
                }}
                defaultSource={require("@/assets/images/slider-1.png")}
              />

              {/* Gradient Overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
                className="absolute bottom-0 left-0 right-0 h-20"
              />

              {/* Genre Badge */}
              {genre && (
                <View className="absolute top-2 right-2 bg-blue_accent px-2 py-1 rounded-md">
                  <Text className="text-white text-[10px] font-semibold">
                    {genre.toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Play Button Overlay */}
              <View className="absolute inset-0 items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
                  <Image
                    source={Icons.PlayButton}
                    className="w-6 h-6"
                    tintColor="#fff"
                  />
                </View>
              </View>
            </View>

            {/* Movie Info */}
            <View className="p-3 px-1">
              <Text
                className="text-white text-sm font-semibold mb-1 leading-5"
                numberOfLines={2}
              >
                {title}
              </Text>

              {/* Year and Type */}
              <View className="flex-row items-center justify-between">
                {/* {year && <Text className="text-grey text-xs">{year}</Text>} */}
                <View className="bg-black px-2 py-1 rounded-full">
                  <Text className="text-grey text-[10px] font-medium">
                    {series ? "SERIES" : "MOVIE"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Rating Badge */}
            {rating && (
              <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex-row items-center">
                <Image
                  source={Icons.star}
                  className="w-3 h-3 mr-1"
                  tintColor="#FFD700"
                />
                <Text className="text-white text-[10px] font-semibold">
                  {rating}
                </Text>
              </View>
            )}

            {/* Language */}
            <View className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded-md flex-row items-center">
              <Text className="text-white text-[10px] font-semibold">Urdu</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
