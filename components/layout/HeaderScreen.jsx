import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const HeaderScreen = ({ title }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between mb-4 mt-12">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 rounded-full bg-card_dark"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">
          {decodeURIComponent(title)}
        </Text>
      </View>
    </View>
  );
};

export default HeaderScreen;
