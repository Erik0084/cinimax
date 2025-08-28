import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const HeaderScreen = ({ title }) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center justify-between px-6 py-4 pt-12">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text className="text-white text-lg font-semibold flex-1 text-center">
        {title}
      </Text>
    </View>
  );
};

export default HeaderScreen;
