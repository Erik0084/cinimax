import { Icons } from "@/constants/icons";
import { useDownloads } from "@/contexts/DownloadContext";
import HeaderScreen from "@components/layout/HeaderScreen";
import DownloadCard from "@components/ui/cards/DownloadCard";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DownloadScreen = () => {
  const { downloads, clearCompleted, DOWNLOAD_STATES } = useDownloads();

  const isEmpty = downloads.length === 0;

  return (
    <View className="flex-1 bg-dark px-6">
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      {/* Header */}
      <HeaderScreen title="Downloads" />
      {isEmpty ? (
        // Empty State
        <View className="flex-1 items-center h-full mt-[-90px] justify-center">
          <Image source={Icons.noResults1} className="w-40 h-40 mb-6" />
          <Text className="text-white text-xl font-bold mb-2">
            No Downloads Yet!
          </Text>
          <Text className="text-grey text-center">
            Start downloading your favorite movies and shows
          </Text>
          <Text className="text-grey text-center">
            to watch them offline anytime
          </Text>
          <TouchableOpacity
            className="mt-8 bg-blue_accent py-3 px-6 rounded-full"
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-white font-bold">Browse Content</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          {/* Download List */}
          <FlatList
            className="mt-2"
            data={downloads}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DownloadCard item={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default DownloadScreen;
