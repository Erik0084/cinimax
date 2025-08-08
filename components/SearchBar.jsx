import { Icons } from "@/constants/icons";

import React from "react";
import { Image, TextInput, View } from "react-native";

export default function SearchBar() {
  return (
    <View className="flex-row items-center bg-soft rounded-full px-[18px] py-2 w-full">
      <Image
        source={Icons.search}
        className="w-6 h-6 mr-2 color-grey"
        resizeMode="contain"
        tintColor="#fff"
      />
      <TextInput
        className="flex-1 text-h6 text-grey"
        placeholder="Search a movie.."
        placeholderTextColor="#ccc"
        underlineColorAndroid="transparent"
      />
      <View className="w-px h-6 bg-gray-600 mx-3 opacity-40" />
      <Image
        source={Icons.options}
        className="w-6 h-6 color-white"
        resizeMode="contain"
        tintColor="#EAAB73"
      />
    </View>
  );
} 