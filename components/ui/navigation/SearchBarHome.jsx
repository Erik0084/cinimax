import { Icons } from "@/constants/icons";

import { useRouter } from "expo-router";
import { forwardRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const SearchBar = forwardRef(({}, ref) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push("/search")}
      className="flex-row items-center bg-soft rounded-full px-[18px] py-4 w-full"
    >
      <Image
        source={Icons.search}
        className="w-6 h-6 mr-2 color-grey"
        resizeMode="contain"
        tintColor="#fff"
      />
      {/* <TextInput
        ref={ref}
        className="flex-1 text-h6 text-grey"
        placeholder="Search a movie.."
        placeholderTextColor="#ccc"
        underlineColorAndroid="transparent"
      /> */}
      <Text className="flex-1 text-h5 text-grey">Search</Text>

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
