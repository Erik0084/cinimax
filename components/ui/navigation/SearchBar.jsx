import { Icons } from "@/constants/icons";

import { useRouter } from "expo-router";
import React, { forwardRef, useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

const SearchBar = forwardRef(({ onSearch, value, onChangeText, editable = true }, ref) => {
  const router = useRouter();
  const [localValue, setLocalValue] = useState("");
  
  const handleTextChange = (text) => {
    if (onChangeText) {
      onChangeText(text);
    } else {
      setLocalValue(text);
    }
    
    // Trigger search on text change with debouncing
    if (onSearch) {
      onSearch(text);
    }
  };
  
  const handlePress = () => {
    if (!editable) {
      router.push("/search");
    }
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center bg-soft rounded-full px-[18px] py-2 w-full"
      disabled={editable}
    >
      <Image
        source={Icons.search}
        className="w-6 h-6 mr-2 color-grey"
        resizeMode="contain"
        tintColor="#fff"
      />
      <TextInput
        ref={ref}
        className="flex-1 text-h6 text-grey"
        placeholder="Search a movie or series.."
        placeholderTextColor="#ccc"
        underlineColorAndroid="transparent"
        value={value !== undefined ? value : localValue}
        onChangeText={handleTextChange}
        editable={editable}
      />
      <View className="w-px h-6 bg-gray-600 mx-3 opacity-40" />
      <Image
        source={Icons.options}
        className="w-6 h-6 color-white"
        resizeMode="contain"
        tintColor="#12CDD9"
      />
    </TouchableOpacity>
  );
});

export default SearchBar;
